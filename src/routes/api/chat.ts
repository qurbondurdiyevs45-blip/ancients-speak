import { createFileRoute } from "@tanstack/react-router";
import { getFigure } from "@/lib/figures";
import { chatSchema } from "@/lib/chat-contract";
import { buildPrompt } from "@/lib/chat-prompt";
import { tr } from "@/lib/i18n";

export const Route = createFileRoute("/api/chat")({server:{handlers:{POST:async({request})=>{
  const origin=request.headers.get("origin");
  if(origin && origin!==new URL(request.url).origin)return Response.json({error:"Forbidden"},{status:403});
  if(Number(request.headers.get("content-length") || 0)>150000)return Response.json({error:"Request too large"},{status:413});
  const body=await request.json().catch(()=>null);
  const parsed=chatSchema.safeParse(body);
  if(!parsed.success)return Response.json({error:"Invalid request"},{status:400});
  const {figureId,userName,lang,messages}=parsed.data;
  const figure=figureId==="al-gid" ? null : getFigure(figureId);
  if(figureId!=="al-gid" && !figure)return Response.json({error:tr("not_found",lang)},{status:404});
  const {streamChatCompletion,GatewayError}=await import("@lovable.dev/ai-gateway");
  try {
    const stream=await streamChatCompletion({model:"google/gemini-3-flash-preview",messages:[{role:"system",content:buildPrompt(figure ?? null,userName || tr("traveler",lang),lang)},...messages]},{signal:request.signal});
    return stream.toResponse({headers:{"Cache-Control":"no-store","X-Content-Type-Options":"nosniff"}});
  } catch(error) {
    if(error instanceof GatewayError)console.error("Chat gateway failure",error.code,error.httpStatus,error.ids);
    else console.error("Chat request failed");
    return Response.json({error:tr("chat_error",lang)},{status:error instanceof GatewayError ? error.httpStatus ?? 502 : 500});
  }
}}});