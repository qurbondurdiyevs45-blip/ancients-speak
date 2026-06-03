import { useState } from "react";

import { clearUser, useUser } from "@/lib/user";

export function ProfileBadge() {
  const { name, points } = useUser();
  const [open, setOpen] = useState(false);

  if (!name) return null;
  const initial = name.trim().charAt(0).toUpperCase();

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="glass flex items-center gap-2.5 rounded-full px-2 py-1.5 pr-3.5 text-xs text-foreground transition hover:brightness-110"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gold-gradient font-bold text-primary-foreground">
          {initial}
        </span>
        <span className="hidden font-medium sm:inline">{name}</span>
        <span className="hidden items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-gold sm:inline-flex">
          ★ {points}
        </span>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl glass-strong p-3 shadow-elegant">
          <p className="px-2 text-xs text-muted-foreground">Hisob</p>
          <p className="mt-0.5 px-2 font-serif text-base font-semibold text-foreground">
            {name}
          </p>
          <div className="mt-2 flex items-center justify-between rounded-lg bg-white/5 px-2.5 py-2 text-xs">
            <span className="text-muted-foreground">Kviz ballari</span>
            <span className="font-bold text-gold">★ {points}</span>
          </div>
          <button
            onClick={() => {
              clearUser();
              setOpen(false);
            }}
            className="mt-3 w-full rounded-lg border border-white/10 px-3 py-2 text-xs text-muted-foreground transition hover:bg-white/5 hover:text-foreground"
          >
            Chiqish
          </button>
        </div>
      )}
    </div>
  );
}