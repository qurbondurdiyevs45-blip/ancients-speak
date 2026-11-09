import { useEffect, useState } from "react";
import { Accessibility, Contrast, Minus, Plus, Sun, Moon } from "lucide-react";
import { useT } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

export function AccessibilityPanel() {
  const {t}=useT();
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState(16);
  const [light, setLight] = useState(false);
  const [contrast, setContrast] = useState(false);
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("ss_accessibility") || "{}");
      setSize(Math.max(16, Math.min(20, Number(saved.size) || 16)));
      setLight(saved.light === true); setContrast(saved.contrast === true);
    } catch { /* Default settings remain usable. */ }
  }, []);
  useEffect(() => {
    document.documentElement.style.fontSize = `${size}px`;
    document.documentElement.classList.toggle("light", light);
    document.documentElement.classList.toggle("high-contrast", contrast);
    try {localStorage.setItem("ss_accessibility", JSON.stringify({ size, light, contrast }));}catch{}
  }, [size, light, contrast]);
  return <div className="fixed bottom-4 left-4 z-50">
    {open && <div className="glass-strong mb-2 w-64 rounded-lg p-4 shadow-elegant">
      <p className="mb-3 font-semibold">{t("access")}</p>
      <div className="flex items-center justify-between gap-2"><span className="text-sm">{t("size")}</span>
        <Button size="icon" variant="outline" title={t("smaller")} aria-label={t("smaller")} disabled={size <= 16} onClick={() => setSize(size - 1)}><Minus /></Button>
        <Button size="icon" variant="outline" title={t("larger")} aria-label={t("larger")} disabled={size >= 20} onClick={() => setSize(size + 1)}><Plus /></Button>
      </div>
      <Button variant="outline" className="mt-3 w-full justify-start" aria-pressed={light} onClick={() => setLight(!light)}>{light ? <Moon /> : <Sun />}{light ? t("dark") : t("light")}</Button>
      <Button variant="outline" className="mt-2 w-full justify-start" aria-pressed={contrast} onClick={() => setContrast(!contrast)}><Contrast />{t("contrast")}</Button>
    </div>}
    <Button size="icon" variant="outline" aria-label={t("access")} title={t("access")} aria-expanded={open} onClick={() => setOpen(!open)} className="glass-strong rounded-full"><Accessibility /></Button>
  </div>;
}