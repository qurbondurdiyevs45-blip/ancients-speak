import { z } from "zod";
import { validName } from "./education-rules";
export const chatSchema = z.object({
  figureId:z.string().min(1).max(80).regex(/^[a-z0-9-]+$/),
  userName:z.string().trim().refine(validName).optional(),
  lang:z.enum(["uz","en","ru","zh"]).default("uz"),
  messages:z.array(z.object({role:z.enum(["user","assistant"]),content:z.string().trim().min(1).max(4000)})).min(1).max(30),
});
export type ChatMessage = {role:"user" | "assistant";content:string};