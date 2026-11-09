export async function shareText(text: string): Promise<"copied" | "shared" | "cancelled"> {
  if (navigator.share) {
    try { await navigator.share({title:"Smart-Sayohat: Ancients Speak",text}); return "shared"; }
    catch(error) { if(error instanceof Error && error.name==="AbortError")return "cancelled"; }
  }
  await navigator.clipboard.writeText(text);
  return "copied";
}