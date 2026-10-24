"use client";
import { useState } from "react";

export default function ContactForm() {
  const [state, setState] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const get = (k: string) => String(fd.get(k) ?? "").trim();
    if (!get("email") && !get("phone")) { setState("error"); setMsg("Informe um e-mail ou um telefone para eu poder responder."); return; }
    setState("sending");
    const q = new URLSearchParams(window.location.search);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: get("name"), email: get("email"), phone: get("phone"), message: get("message"), website: get("website"),
          channel: "formulario", source: q.get("utm_source") ?? "direto", campaign: q.get("utm_campaign") ?? "",
        }),
      });
      if (!res.ok) throw new Error("falhou");
      (window as any).fbq?.("track", "Lead");
      (window as any).ttq?.track?.("SubmitForm");
      form.reset();
      setState("ok");
    } catch {
      setState("error"); setMsg("Não consegui enviar agora. Tente de novo ou chame no WhatsApp.");
    }
  }

  if (state === "ok") return <p className="form-ok" role="status">Recebi a sua mensagem. Respondo em breve. Obrigado!</p>;

  return (
    <form className="contact" onSubmit={onSubmit}>
      <label>Seu nome<input name="name" required maxLength={80} autoComplete="name" /></label>
      <div className="row2">
        <label>E-mail<input name="email" type="email" maxLength={100} autoComplete="email" /></label>
        <label>Telefone<input name="phone" inputMode="tel" maxLength={30} autoComplete="tel" placeholder="(21) 90000-0000" /></label>
      </div>
      <label>Sua mensagem<textarea name="message" required maxLength={1500} rows={5} placeholder="Conte o seu ramo e o que você precisa" /></label>
      <input name="website" className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      {state === "error" && <p className="form-err" role="alert">{msg}</p>}
      <button className="cta" disabled={state === "sending"}>{state === "sending" ? "Enviando..." : "Enviar mensagem"}</button>
      <small>Usamos seus dados só para responder ao seu contato. Veja a <a href="/privacidade">política de privacidade</a>.</small>
    </form>
  );
}
