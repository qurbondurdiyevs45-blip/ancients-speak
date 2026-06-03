import { useEffect, useState } from "react";

import { quoteOfTheDay, type Quote } from "@/lib/quotes";

export function QuoteOfTheDay() {
  const [q, setQ] = useState<Quote | null>(null);
  useEffect(() => setQ(quoteOfTheDay()), []);
  if (!q) return null;
  return (
    <div className="glass relative overflow-hidden rounded-3xl p-6 sm:p-8">
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gold-gradient opacity-20 blur-3xl" />
      <p className="text-xs font-semibold uppercase tracking-widest text-gold">
        ✦ Kun hikmati
      </p>
      <blockquote className="mt-3 font-serif text-xl leading-snug text-foreground sm:text-2xl">
        “{q.text}”
      </blockquote>
      <p className="mt-3 text-sm text-muted-foreground">— {q.author}</p>
    </div>
  );
}