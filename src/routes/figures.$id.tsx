import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

import { CATEGORY_LABELS, getFigure, type Figure } from "@/lib/figures";
import { useUser } from "@/lib/user";
import {
  createRecognizer,
  createSpeechController,
  isSTTAvailable,
  isTTSAvailable,
  stopSpeak,
  type SpeechController,
} from "@/lib/speech";
import { FigureAvatar } from "@/components/FigureAvatar";

type Msg = { role: "user" | "assistant"; content: string };

export const Route = createFileRoute("/figures/$id")({
  loader: ({ params }) => {
    const fig = getFigure(params.id);
    if (!fig) throw notFound();
    return { figure: fig as Figure };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.figure.name} bilan suhbat — Smart-Sayohat` },
          {
            name: "description",
            content: `${loaderData.figure.name} (${loaderData.figure.era}) bilan AI orqali jonli o'zbekcha suhbat.`,
          },
          { property: "og:title", content: `${loaderData.figure.name} — Smart-Sayohat` },
          { property: "og:description", content: loaderData.figure.bio },
          ...(loaderData.figure.image
            ? [{ property: "og:image", content: loaderData.figure.image }]
            : []),
        ]
      : [],
  }),
  errorComponent: ({ error }) => (
    <div className="p-10 text-center text-sm text-destructive">{error.message}</div>
  ),
  notFoundComponent: () => (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-10">
      <p className="font-serif text-2xl">Bunday shaxs topilmadi.</p>
      <Link to="/" className="text-sm text-primary underline">
        ← Bosh sahifaga qaytish
      </Link>
    </div>
  ),
  component: ChatPage,
});

function ChatPage() {
  const { figure } = Route.useLoaderData() as { figure: Figure };
  const { name } = useUser();
  const userName = name || "sayyoh";
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [speakingIdx, setSpeakingIdx] = useState<number | null>(null);
  const [playState, setPlayState] = useState<"playing" | "paused" | "stopped" | "ended">("stopped");
  const [listening, setListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recRef = useRef<ReturnType<typeof createRecognizer>>(null);
  const ctrlRef = useRef<SpeechController | null>(null);

  useEffect(() => () => {
    ctrlRef.current?.stop();
    stopSpeak();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const suggestions = [
    "O‘zingiz haqingizda qisqacha so‘zlab bering.",
    "Eng katta yutuq va sinovlaringiz nimada edi?",
    "Bugungi yoshlarga qanday maslahat berasiz?",
    "Sevimli iborangizni ayting.",
  ];

  async function send(textArg?: string) {
    const text = (textArg ?? input).trim();
    if (!text || isStreaming) return;
    setError(null);
    const userMsg: Msg = { role: "user", content: text };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput("");
    setIsStreaming(true);

    let assistant = "";
    const upsert = (chunk: string) => {
      assistant += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) =>
            i === prev.length - 1 ? { ...m, content: assistant } : m,
          );
        }
        return [...prev, { role: "assistant", content: assistant }];
      });
    };

    try {
      const resp = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          figureId: figure.id,
          messages: nextMessages,
          userName,
        }),
      });

      if (!resp.ok || !resp.body) {
        const data = await resp.json().catch(() => ({ error: "Xatolik" }));
        throw new Error(data.error || `HTTP ${resp.status}`);
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let done = false;
      while (!done) {
        const { done: d, value } = await reader.read();
        if (d) break;
        buf += decoder.decode(value, { stream: true });
        let idx: number;
        while ((idx = buf.indexOf("\n")) !== -1) {
          let line = buf.slice(0, idx);
          buf = buf.slice(idx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line || line.startsWith(":")) continue;
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") {
            done = true;
            break;
          }
          try {
            const parsed = JSON.parse(json);
            const c = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (c) upsert(c);
          } catch {
            buf = line + "\n" + buf;
            break;
          }
        }
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Noma’lum xatolik");
    } finally {
      setIsStreaming(false);
    }
  }

  function startSpeak(idx: number, text: string) {
    ctrlRef.current?.stop();
    const c = createSpeechController(text, {
      onStateChange: setPlayState,
      onEnd: () => {
        setSpeakingIdx(null);
        setPlayState("ended");
      },
    });
    ctrlRef.current = c;
    setSpeakingIdx(idx);
    c.play();
  }
  function pauseSpeak() {
    ctrlRef.current?.pause();
  }
  function resumeSpeak() {
    ctrlRef.current?.resume();
  }
  function stopSpeakNow() {
    ctrlRef.current?.stop();
    setSpeakingIdx(null);
    setPlayState("stopped");
  }

  function toggleMic() {
    if (listening) {
      recRef.current?.stop();
      setListening(false);
      return;
    }
    const r = createRecognizer();
    if (!r) {
      setError("Brauzeringiz ovozli kiritishni qo‘llab-quvvatlamaydi.");
      return;
    }
    recRef.current = r;
    r.onresult = (e) => {
      const t = e.results[0][0].transcript;
      setInput((p) => (p ? p + " " + t : t));
    };
    r.onerror = () => setListening(false);
    r.onend = () => setListening(false);
    setListening(true);
    try {
      r.start();
    } catch {
      setListening(false);
    }
  }

  const ttsOn = isTTSAvailable();
  const sttOn = isSTTAvailable();

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-white/10 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
          <Link
            to="/"
            className="glass rounded-lg px-2.5 py-1.5 text-xs font-medium hover:bg-white/10"
          >
            ← Orqaga
          </Link>
          <div className="flex flex-1 items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-full ring-2 ring-gold/40">
              {figure.image ? (
                <img src={figure.image} alt={figure.name} className="h-full w-full object-cover" />
              ) : (
                <FigureAvatar figure={figure} />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-serif text-sm font-semibold text-foreground">{figure.name}</p>
              <p className="truncate text-[11px] text-muted-foreground">
                {figure.era} · {CATEGORY_LABELS[figure.category]}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div ref={scrollRef} className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 overflow-y-auto px-4 py-6">
        {messages.length === 0 && (
          <div className="glass rounded-2xl p-5 shadow-elegant">
            <p className="font-serif text-lg font-semibold text-foreground">
              Assalomu alaykum, {userName}.
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              Men — <strong>{figure.name}</strong>. {figure.bio} Menga istalgan
              savolingizni bering yoki quyidagilardan birini tanlang:
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-foreground transition hover:border-gold/40 hover:bg-white/10"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => {
          const time = new Date().toLocaleTimeString("uz-UZ", {
            hour: "2-digit",
            minute: "2-digit",
          });
          if (m.role === "user") {
            return (
              <div key={i} className="ml-auto flex max-w-[85%] flex-col items-end gap-1">
                <div className="rounded-2xl rounded-br-md bg-gold-gradient px-4 py-2.5 text-sm leading-relaxed text-primary-foreground shadow-gold">
                  <p className="whitespace-pre-wrap">{m.content}</p>
                </div>
                <span className="text-[10px] text-muted-foreground">{userName} · {time}</span>
              </div>
            );
          }
          const isSpeaking = speakingIdx === i;
          return (
            <div key={i} className="mr-auto flex max-w-[85%] flex-col gap-1">
              <div className="glass rounded-2xl rounded-bl-md px-4 py-3 text-sm leading-relaxed text-foreground shadow-elegant">
                <div className="prose prose-sm prose-invert max-w-none prose-p:my-1 prose-strong:text-gold">
                  <ReactMarkdown>{m.content || "…"}</ReactMarkdown>
                </div>
                {ttsOn && m.content && (
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-2">
                    <div className="flex items-center gap-1.5">
                      {!isSpeaking && (
                        <button
                          onClick={() => startSpeak(i, m.content)}
                          className="flex items-center gap-1.5 rounded-full bg-gold-gradient px-3 py-1 text-[11px] font-semibold text-primary-foreground shadow-gold transition hover:brightness-110"
                        >
                          ▶ Eshitish
                        </button>
                      )}
                      {isSpeaking && playState === "playing" && (
                        <button
                          onClick={pauseSpeak}
                          className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold text-foreground transition hover:bg-white/20"
                        >
                          ❚❚ Pauza
                        </button>
                      )}
                      {isSpeaking && playState === "paused" && (
                        <button
                          onClick={resumeSpeak}
                          className="flex items-center gap-1.5 rounded-full bg-gold-gradient px-3 py-1 text-[11px] font-semibold text-primary-foreground shadow-gold"
                        >
                          ▶ Davom
                        </button>
                      )}
                      {isSpeaking && (
                        <button
                          onClick={stopSpeakNow}
                          aria-label="To‘xtatish"
                          className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-[11px] text-foreground hover:bg-white/15"
                        >
                          ■
                        </button>
                      )}
                      {isSpeaking && playState === "playing" && (
                        <span className="ml-1 flex h-3 items-end gap-[2px]">
                          <span className="wave-bar h-full w-[2px] bg-gold" style={{ animationDelay: "0s" }} />
                          <span className="wave-bar h-full w-[2px] bg-gold" style={{ animationDelay: "0.15s" }} />
                          <span className="wave-bar h-full w-[2px] bg-gold" style={{ animationDelay: "0.3s" }} />
                          <span className="wave-bar h-full w-[2px] bg-gold" style={{ animationDelay: "0.45s" }} />
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-muted-foreground">{figure.name} · {time}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isStreaming && messages[messages.length - 1]?.role === "user" && (
          <div className="mr-auto glass flex items-center gap-1.5 rounded-2xl px-4 py-3">
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gold [animation-delay:-0.3s]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gold [animation-delay:-0.15s]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gold" />
          </div>
        )}

        {error && (
          <div className="mr-auto rounded-xl border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
            {error}
          </div>
        )}
      </div>

      {/* Composer */}
      <div className="sticky bottom-0 border-t border-white/10 bg-background/80 backdrop-blur-xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          className="mx-auto flex max-w-3xl gap-2 px-4 py-3"
        >
          <div className="glass flex flex-1 items-center gap-1.5 rounded-xl pl-3 pr-1.5">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isStreaming}
              placeholder={`${figure.name}ga savol bering...`}
              className="flex-1 bg-transparent py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none disabled:opacity-60"
            />
            {sttOn && (
              <button
                type="button"
                onClick={toggleMic}
                aria-label="Ovozli kiritish"
                className={
                  "flex h-8 w-8 items-center justify-center rounded-lg text-sm transition " +
                  (listening
                    ? "bg-destructive/80 text-destructive-foreground animate-pulse"
                    : "bg-white/10 text-foreground hover:bg-white/15")
                }
              >
                🎤
              </button>
            )}
          </div>
          <button
            type="submit"
            disabled={isStreaming || !input.trim()}
            className="rounded-xl bg-gold-gradient px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-gold transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Yuborish
          </button>
        </form>
      </div>
    </div>
  );
}