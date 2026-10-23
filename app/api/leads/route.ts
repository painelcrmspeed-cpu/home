import { NextResponse } from "next/server";
export const runtime = "nodejs";

const clean = (v: unknown, max = 100) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(req: Request) {
  const b = await req.json().catch(() => null);
  const lead = {
    name: clean(b?.name, 80),
    phone: clean(b?.phone, 30),
    niche: clean(b?.niche, 40),
    model: clean(b?.model, 40),
    source: clean(b?.source, 40) || "direto",
    campaign: clean(b?.campaign, 60),
  };
  if (!lead.name) return NextResponse.json({ ok: false }, { status: 400 });

  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY: KEY, RESEND_API_KEY, LEAD_NOTIFY_EMAIL, LEAD_FROM_EMAIL } = process.env;
  const jobs: Promise<Response>[] = [];

  if (SUPABASE_URL && KEY) {
    jobs.push(fetch(`${SUPABASE_URL}/rest/v1/leads`, {
      method: "POST",
      headers: { apikey: KEY, Authorization: `Bearer ${KEY}`, "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify(lead),
    }));
  }
  if (RESEND_API_KEY && LEAD_NOTIFY_EMAIL && LEAD_FROM_EMAIL) {
    jobs.push(fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: LEAD_FROM_EMAIL,
        to: LEAD_NOTIFY_EMAIL,
        subject: `Novo lead: ${lead.name} (${lead.niche}, ${lead.model})`,
        text: `Nome: ${lead.name}\nWhatsApp: ${lead.phone || "-"}\nRamo: ${lead.niche}\nModelo: ${lead.model}\nOrigem: ${lead.source}\nCampanha: ${lead.campaign || "-"}`,
      }),
    }));
  }
  await Promise.allSettled(jobs);
  return NextResponse.json({ ok: true });
}
