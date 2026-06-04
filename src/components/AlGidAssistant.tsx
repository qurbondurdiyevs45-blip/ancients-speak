import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

import { useUser } from "@/lib/user";

type Msg = { role: "user" | "assistant"; content: string };

export function AlGidAssistant() {
  const { name } = useUser();
  const userName = name || "sayyoh";
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  async function send(textArg?: string) {
    const text = (textArg ?? input).trim();
    if (!text || streaming) return;
    setError(null);
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setStreaming(true);
    let acc = "";
    const push = (chunk: string) => {
      acc += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: acc } : m));
        }
        return [...prev, { role: "assistant", content: acc }];
      });
    };
    try {
      const resp = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ figureId: "al-gid", messages: next, userName }),
      });
      if (!resp.ok || !resp.body) {
        const d = await resp.json().catch(() => ({ error: "Xatolik" }));
        throw new Error(d.error || `HTTP ${resp.status}`);
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
            if (c) push(c);
          } catch {
            buf = line + "\n" + buf;
            break;
          }
        }
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Noma’lum xatolik");
    } finally {
      setStreaming(false);
    }
  }

  const suggestions = [
    "Amir Temur haqida qisqacha so'zlab ber.",
    "Bugun qaysi mavzuni o'rgansam bo'ladi?",
    "Al-Xorazmiy algebrani qanday yaratgan?",
    "Tarixiy kvizni qanday boshlayman?",
  ];

  return (
    <>
      {/* Floating FAB */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Al-Gid AI ni ochish"
          className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gold-gradient text-2xl text-primary-foreground shadow-gold transition hover:brightness-110"
        >
          <span aria-hidden>✦</span>
          <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-background" />
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-0 sm:p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="glass-strong relative flex h-[88vh] w-full max-w-md flex-col overflow-hidden rounded-t-3xl sm:h-[640px] sm:rounded-3xl">
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-white/10 p-4">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-aurora-gradient text-lg font-serif font-bold text-white shadow-gold">
                ✦
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-background" />
              </div>
              <div className="flex-1">
                <p className="font-serif text-sm font-semibold text-foreground">Al-Gid AI</p>
                <p className="text-[11px] text-muted-foreground">Aqlli yo‘ldosh · doim onlayn</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Yopish"
                className="rounded-lg bg-white/5 px-2.5 py-1.5 text-xs text-foreground transition hover:bg-white/10"
              >
                ✕
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.length === 0 && (
                <div className="space-y-3">
                  <div className="glass rounded-2xl p-3 text-sm text-foreground">
                    Assalomu alaykum, <strong>{userName}</strong>. Men — <strong className="text-gold">Al-Gid AI</strong>, sizning aqlli yo‘ldoshingiz. Tarix, ilovadan foydalanish yoki boshqa savollaringiz bo‘lsa, marhamat:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((s) => (
                      <button
                        key={s}
                        onClick={() => send(s)}
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] text-foreground transition hover:border-gold/40 hover:bg-white/10"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map((m, i) =>
                m.role === "user" ? (
                  <div
                    key={i}
                    className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-gold-gradient px-3 py-2 text-sm text-primary-foreground shadow-gold"
                  >
                    {m.content}
                  </div>
                ) : (
                  <div
                    key={i}
                    className="glass mr-auto max-w-[88%] rounded-2xl rounded-bl-md px-3 py-2 text-sm text-foreground"
                  >
                    <div className="prose prose-sm prose-invert max-w-none prose-p:my-1 prose-strong:text-gold">
                      <ReactMarkdown>{m.content || "…"}</ReactMarkdown>
                    </div>
                  </div>
                ),
              )}
              {streaming && messages[messages.length - 1]?.role === "user" && (
                <div className="glass mr-auto flex w-fit gap-1.5 rounded-2xl px-3 py-2">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gold [animation-delay:-0.3s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gold [animation-delay:-0.15s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gold" />
                </div>
              )}
              {error && (
                <div className="rounded-xl border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                  {error}
                </div>
              )}
            </div>

            {/* Composer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
              className="flex gap-2 border-t border-white/10 p-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={streaming}
                placeholder="Al-Gid AI ga yozing..."
                className="glass flex-1 rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none ring-primary focus:ring-2"
              />
              <button
                type="submit"
                disabled={streaming || !input.trim()}
                className="rounded-xl bg-gold-gradient px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-gold transition hover:brightness-110 disabled:opacity-50"
              >
                ➤
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}