import { createFileRoute } from "@tanstack/react-router";

import { getFigure } from "@/lib/figures";

type Msg = { role: "user" | "assistant"; content: string };

function buildSystemPrompt(figureId: string, userName: string): string {
  const fig = getFigure(figureId);
  if (!fig) {
    return `Siz tarixiy shaxs rolida o'zbek tilida javob beruvchi virtual gidsiz. Foydalanuvchi ismi: ${userName}.`;
  }
  return [
    `Siz — ${fig.name} (${fig.era}), ${fig.role}.`,
    `Qisqacha: ${fig.bio}`,
    `Nutq uslubi: ${fig.voiceHint}.`,
    `Foydalanuvchi — 21-asr sayohatchisi, ismi ${userName}. Unga JONLI, BIRINCHI shaxsda, o'zingizning xarakteringiz va davringiz tilida o'zbek tilida javob bering.`,
    `Hech qachon "men AI/sun'iy intellektman" demang — siz ${fig.name}sis. Bilmagan zamonaviy narsani so'rashsa, o'z davringizdan turib hayron bo'ling yoki taqqoslang.`,
    `Javoblar tabiiy, hikoyatchan, lekin uzun emas (3–6 jumla). Kerak bo'lsa Sardorbekka savol qaytaring.`,
    `Markdown formatdan oddiy ishlating (qalin, ro'yxat) — ortiqcha emojiga berilmang.`,
  ].join("\n");
}

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { figureId, messages, userName } = (await request.json()) as {
            figureId: string;
            messages: Msg[];
            userName?: string;
          };

          const apiKey = process.env.LOVABLE_API_KEY;
          if (!apiKey) {
            return new Response(
              JSON.stringify({ error: "LOVABLE_API_KEY not configured" }),
              { status: 500, headers: { "Content-Type": "application/json" } },
            );
          }

          const system = buildSystemPrompt(figureId, userName || "sayyoh");

          const upstream = await fetch(
            "https://ai.gateway.lovable.dev/v1/chat/completions",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                model: "google/gemini-3-flash-preview",
                stream: true,
                messages: [
                  { role: "system", content: system },
                  ...messages,
                ],
              }),
            },
          );

          if (!upstream.ok) {
            const text = await upstream.text();
            const status = upstream.status;
            let message = "AI bilan bog'lanishda xatolik yuz berdi.";
            if (status === 429) message = "So'rovlar juda ko'p — biroz kuting.";
            if (status === 402) message = "AI kreditlari tugadi.";
            console.error("AI gateway error:", status, text);
            return new Response(JSON.stringify({ error: message }), {
              status,
              headers: { "Content-Type": "application/json" },
            });
          }

          return new Response(upstream.body, {
            headers: {
              "Content-Type": "text/event-stream",
              "Cache-Control": "no-cache",
            },
          });
        } catch (e) {
          console.error("chat handler error:", e);
          return new Response(
            JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }
      },
    },
  },
});