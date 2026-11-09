import type { ChatMessage } from "./chat-contract";
import { tr, type Lang } from "./i18n";
export async function streamChat(figureId:string,userName:string,lang:Lang,messages:ChatMessage[],signal:AbortSignal,onChunk:(text:string)=>void) {
  const response=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({figureId,userName,lang,messages:messages.slice(-30)}),signal});
  if(!response.ok || !response.body)throw new Error(tr("chat_error",lang));
  const reader=response.body.getReader();const decoder=new TextDecoder();let buffer="";
  function line(raw:string):boolean {
    if(!raw.startsWith("data:"))return false;
    const data=raw.slice(5).trim();if(data==="[DONE]")return true;
    let event: {error?:unknown;type?:string;choices?:Array<{delta?:{content?:string}}>};
    try{event=JSON.parse(data);}catch{throw new Error(tr("chat_error",lang));}
    if(event.error || event.type==="error" || event.type==="response.failed")throw new Error(tr("chat_error",lang));
    const content=event.choices?.[0]?.delta?.content;if(content)onChunk(content);
    return false;
  }
  try{while(true){const chunk=await reader.read();buffer+=decoder.decode(chunk.value,{stream:!chunk.done});let i:number;while((i=buffer.indexOf("\n"))>=0){const raw=buffer.slice(0,i).replace(/\r$/,"");buffer=buffer.slice(i+1);if(line(raw))return;}if(chunk.done){if(buffer.trim())line(buffer);break;}}}
  finally{await reader.cancel().catch(()=>{});reader.releaseLock();}
}