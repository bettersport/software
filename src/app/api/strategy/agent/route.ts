import { withUser, json, badRequest } from "@/lib/server-data";
import { betterAgentAnswer } from "@/lib/strategy/claude";

/** POST { question, step, orgType?, sport? } → respuesta del Better Agent (guía de proceso). */
export async function POST(req: Request) {
  const ctx = await withUser();
  if ("res" in ctx) return ctx.res;
  const b = await req.json().catch(() => ({}));
  const question = String(b.question ?? "").trim();
  if (!question) return badRequest("Escribe una pregunta");
  const r = await betterAgentAnswer(question.slice(0, 1000), Number(b.step ?? 0), { orgType: b.orgType, sport: b.sport });
  return json(r);
}
