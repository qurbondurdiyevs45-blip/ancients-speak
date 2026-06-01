import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

import { CATEGORY_LABELS, getFigure, type Figure } from "@/lib/figures";

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

function initials(name: string) {
  return name.replace(/[‘’']/g, "").split(/\s+/).slice(0, 2).map((s) => s[0]).join("").toUpperCase();
}

function ChatPage() {
  const { figure } = Route.useLoaderData() as { figure: Figure };
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const suggestions = [
    "O'zingiz haqingizda qisqacha so'zlab bering.",
    "Eng katta yutuq va sinovlaringiz nimada edi?",
    "Bugungi yoshlarga qanday maslahat berasiz?",
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
          userName: "Sardorbek",
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
      setError(e instanceof Error ? e.message : "Noma'lum xatolik");
    } finally {
      setIsStreaming(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-border bg-card/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
          <Link
            to="/"
            className="rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-medium hover:bg-secondary"
          >
            ← Orqaga
          </Link>
          <div className="flex flex-1 items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-full bg-gold-gradient ring-2 ring-gold/40">
              {figure.image ? (
                <img src={figure.image} alt={figure.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center font-serif text-sm font-bold text-foreground">
                  {initials(figure.name)}
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-serif text-sm font-semibold">{figure.name}</p>
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
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <p className="font-serif text-lg font-semibold">
              Assalomu alaykum, Sardorbek.
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Men — <strong>{figure.name}</strong>. {figure.bio} Menga istalgan
              savolingizni bering yoki quyidagilardan birini tanlang:
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-full border border-border bg-background px-3 py-1.5 text-xs hover:bg-secondary"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div
            key={i}
            className={
              "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed " +
              (m.role === "user"
                ? "ml-auto bg-primary text-primary-foreground"
                : "mr-auto border border-border bg-card text-card-foreground shadow-sm")
            }
          >
            {m.role === "assistant" ? (
              <div className="prose prose-sm max-w-none prose-p:my-1 prose-strong:text-foreground">
                <ReactMarkdown>{m.content || "…"}</ReactMarkdown>
              </div>
            ) : (
              <p className="whitespace-pre-wrap">{m.content}</p>
            )}
          </div>
        ))}

        {isStreaming && messages[messages.length - 1]?.role === "user" && (
          <div className="mr-auto flex items-center gap-1 rounded-2xl border border-border bg-card px-4 py-3">
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary" />
          </div>
        )}

        {error && (
          <div className="mr-auto rounded-xl border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
            {error}
          </div>
        )}
      </div>

      {/* Composer */}
      <div className="sticky bottom-0 border-t border-border bg-card/90 backdrop-blur">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          className="mx-auto flex max-w-3xl gap-2 px-4 py-3"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isStreaming}
            placeholder={`${figure.name}ga savol bering...`}
            className="flex-1 rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none ring-ring focus:ring-2 disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={isStreaming || !input.trim()}
            className="rounded-xl bg-gold-gradient px-4 py-2.5 text-sm font-semibold text-foreground shadow-gold transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Yuborish
          </button>
        </form>
      </div>
    </div>
  );
}