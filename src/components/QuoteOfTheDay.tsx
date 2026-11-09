import { useEffect, useState } from "react";
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useT } from "@/lib/i18n";
import { dailyWisdom } from "@/lib/learning";
import { shareText } from "@/lib/share";
export function QuoteOfTheDay(){const {lang,t}=useT();const [q,setQ]=useState<ReturnType<typeof dailyWisdom>|null>(null);const [status,setStatus]=useState("");useEffect(()=>{const update=()=>setQ(dailyWisdom());update();const timer=setInterval(update,30000);return()=>clearInterval(timer);},[]);if(!q)return null;
 async function share(){if(!q)return;try{const result=await shareText(`“${q.text[lang] ?? q.text.uz}” — ${t("folk")}\nSmart-Sayohat: Ancients Speak\n${window.location.origin}`);if(result==="copied")setStatus(t("copied"));}catch{setStatus(t("share_error"));}}
 return <aside className="border-l-2 border-gold py-2 pl-5"><p className="text-xs font-semibold text-gold">{t("quote")}</p><blockquote className="mt-3 font-serif text-xl leading-relaxed">“{q.text[lang] ?? q.text.uz}”</blockquote><p className="mt-3 text-sm text-muted-foreground">— {t("folk")}</p><div className="mt-3 flex flex-wrap items-center gap-3"><span className="text-xs text-muted-foreground">{t("tomorrow")}</span><Button variant="ghost" onClick={share}><Share2/>{t("share")}</Button><span role="status" className="text-xs">{status}</span></div></aside>;
}
