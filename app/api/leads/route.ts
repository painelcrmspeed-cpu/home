import { NextResponse } from "next/server";
export const runtime = "nodejs";

const clean = (v: unknown, max = 100) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  const b = await req.json().catch(() => null);
  if (!b) return NextResponse.json({ ok: false }, { status: 400 });
  if (clean(b.website)) return NextResponse.json({ ok: true }); // campo escondido preenchido: robô

  const lead = {
    name: clean(b.name, 80),
    email: clean(b.email, 100),
    phone: clean(b.phone, 30),
    niche: clean(b.niche, 40),
    ramo: clean(b.ramo, 60),
    model: clean(b.model, 60),
    message: clean(b.message, 1500),
    channel: clean(b.channel, 20) === "formulario" ? "formulario" : "whatsapp",
    source: clean(b.source, 40) || "direto",
    campaign: clean(b.campaign, 60),
  };
  if (!lead.name) return NextResponse.json({ ok: false }, { status: 400 });
  if (lead.email && !EMAIL.test(lead.email)) return NextResponse.json({ ok: false }, { status: 400 });
  if (lead.channel === "formulario" && (!lead.message || (!lead.email && !lead.phone))) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY: KEY, RESEND_API_KEY, LEAD_NOTIFY_EMAIL, LEAD_FROM_EMAIL } = process.env;
  const names: string[] = [];
  const jobs: Promise<Response>[] = [];

  if (SUPABASE_URL && KEY) {
    names.push("supabase");
    jobs.push(fetch(`${SUPABASE_URL}/rest/v1/leads`, {
      method: "POST",
      headers: {
        apikey: KEY,
        // a chave antiga (service_role) e um JWT que comeca com "eyJ"; a chave nova (sb_secret_...) vai so no apikey
        ...(KEY.startsWith("eyJ") ? { Authorization: `Bearer ${KEY}` } : {}),
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(lead),
    }));
  }
  if (RESEND_API_KEY && LEAD_NOTIFY_EMAIL && LEAD_FROM_EMAIL) {
    names.push("resend");
    jobs.push(fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: LEAD_FROM_EMAIL,
        to: LEAD_NOTIFY_EMAIL,
        ...(lead.email ? { reply_to: lead.email } : {}),
        subject: `Novo contato (${lead.channel}): ${lead.name}`,
        text: [
          `Nome: ${lead.name}`, `E-mail: ${lead.email || "-"}`, `Telefone: ${lead.phone || "-"}`,
          `Ramo: ${lead.ramo || lead.niche || "-"}`, `Modelo: ${lead.model || "-"}`,
          `Origem: ${lead.source}`, `Campanha: ${lead.campaign || "-"}`, `Canal: ${lead.channel}`,
          lead.message ? `\nMensagem:\n${lead.message}` : "",
        ].join("\n"),
      }),
    }));
  } else {
    console.error("lead: Resend nao configurado (faltam RESEND_API_KEY, LEAD_FROM_EMAIL ou LEAD_NOTIFY_EMAIL)");
  }

  const results = await Promise.allSettled(jobs);
  let okCount = 0;
  for (let i = 0; i < results.length; i++) {
    const r = results[i];
    if (r.status === "rejected") console.error(`lead: ${names[i]} falhou`, r.reason);
    else if (!r.value.ok) console.error(`lead: ${names[i]} respondeu erro`, r.value.status, await r.value.text().catch(() => ""));
    else okCount++;
  }

  // No formulário, se nada foi entregue (nem e-mail, nem banco), avisa a pessoa em vez de fingir que deu certo.
  if (lead.channel === "formulario" && okCount === 0) {
    return NextResponse.json({ ok: false }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
