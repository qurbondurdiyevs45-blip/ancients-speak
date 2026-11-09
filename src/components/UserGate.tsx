import { useEffect, useState, type ReactNode } from "react";

import { setUserName, useUser } from "@/lib/user";
import { validName } from "@/lib/education-rules";
import { useT } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Button } from "@/components/ui/button";

export function UserGate({ children }: { children: ReactNode }) {
  const {t}=useT();
  const { name } = useUser();
  const [mounted, setMounted] = useState(false);
  const [value, setValue] = useState("");

  useEffect(() => setMounted(true), []);

  if (!mounted) return <>{children}</>;

  if (name) return <>{children}</>;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const v = value.trim();
    if (!validName(v)) return;
    setUserName(v);
  }

  return (
    <>
      {children}
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-md p-4">
        <div className="aurora-bg w-full max-w-md">
          <form
            onSubmit={submit}
            role="dialog" aria-modal="true" aria-label={t("gate_title")} className="glass-strong relative w-full rounded-lg p-5 sm:p-8 shadow-elegant"
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
            <div className="mb-5"><LanguageSwitcher/></div>
            <h3 className="font-serif text-2xl font-bold text-foreground">
              {t("gate_title")}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("gate_sub")}
            </p>
            <label className="mt-6 block">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {t("name")}
              </span>
              <input
                autoFocus
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={t("name_placeholder")}
                maxLength={40}
                aria-invalid={value.length > 0 && !validName(value)}
                aria-describedby="name-rule"
                className="mt-2 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-base text-foreground outline-none ring-primary transition focus:ring-2"
              />
            </label>
            <p id="name-rule" className="mt-2 text-xs text-muted-foreground">{t("name_rule")}</p>
            <Button
              type="submit"
              disabled={!validName(value)}
              className="mt-6 w-full rounded-xl bg-gold-gradient px-5 py-3 text-sm font-semibold text-primary-foreground shadow-gold transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {t("start")}
            </Button>
            <p className="mt-4 text-center text-[11px] text-muted-foreground">
              {t("storage")}
            </p>
          </form>
        </div>
      </div>
    </>
  );
}