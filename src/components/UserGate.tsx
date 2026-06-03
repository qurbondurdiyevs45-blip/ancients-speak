import { useEffect, useState, type ReactNode } from "react";

import { setUserName, useUser } from "@/lib/user";

export function UserGate({ children }: { children: ReactNode }) {
  const { name } = useUser();
  const [mounted, setMounted] = useState(false);
  const [value, setValue] = useState("");

  useEffect(() => setMounted(true), []);

  if (!mounted) return <>{children}</>;

  if (name) return <>{children}</>;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const v = value.trim();
    if (v.length < 2) return;
    setUserName(v);
  }

  return (
    <>
      {children}
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-md p-4">
        <div className="aurora-bg w-full max-w-md">
          <form
            onSubmit={submit}
            className="glass-strong relative w-full rounded-3xl p-8 shadow-elegant"
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold-gradient text-xl font-bold text-primary-foreground shadow-gold">
                ✦
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-primary">
                  Smart-Sayohat
                </p>
                <h2 className="font-serif text-xl font-bold text-foreground">
                  Ancients Speak
                </h2>
              </div>
            </div>
            <h3 className="font-serif text-2xl font-bold text-foreground">
              Xush kelibsiz, sayyoh.
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Tarixiy shaxslar sizni shaxsan tanishi uchun ismingizni kiriting.
            </p>
            <label className="mt-6 block">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Ismingiz
              </span>
              <input
                autoFocus
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Masalan, Sardorbek"
                maxLength={32}
                className="mt-2 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-base text-foreground outline-none ring-primary transition focus:ring-2"
              />
            </label>
            <button
              type="submit"
              disabled={value.trim().length < 2}
              className="mt-6 w-full rounded-xl bg-gold-gradient px-5 py-3 text-sm font-semibold text-primary-foreground shadow-gold transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Sayohatni boshlash →
            </button>
            <p className="mt-4 text-center text-[11px] text-muted-foreground">
              Ma’lumotlaringiz faqat shu brauzerda saqlanadi.
            </p>
          </form>
        </div>
      </div>
    </>
  );
}