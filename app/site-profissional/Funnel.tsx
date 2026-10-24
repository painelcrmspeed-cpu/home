"use client";
import { useState } from "react";

const WA = process.env.NEXT_PUBLIC_WHATSAPP ?? "5521999999999";

export type Img = { src: string; id: string; label: string; desc: string };
export type NicheData = { id: string; key: string; label: string; images: Img[] };

// [ramo mostrado na lista, pasta de modelos que ele usa]
const RAMOS: [string, string][] = [
  ["Advocacia", "advogado"], ["Contabilidade", "contador"], ["Consultoria e coaching", "prestador"],
  ["Imobiliária e corretor", "prestador"], ["Escola e cursos", "landingpage"], ["Infoprodutos e vendas online", "landingpage"],
  ["Clínica médica", "medico-consultorio"], ["Dentista", "dentista"], ["Psicologia e terapia", "terapeuta"],
  ["Fisioterapia", "terapeuta"], ["Nutrição", "clinica"], ["Veterinário", "clinica"],
  ["Salão de beleza", "barbearia"], ["Barbearia", "barbearia"], ["Manicure e sobrancelha", "barbearia"],
  ["Estética e spa", "terapeuta"], ["Academia e personal", "personal"], ["Pilates e yoga", "personal"],
  ["Restaurante e lanchonete", "restaurante"], ["Pizzaria", "restaurante"], ["Confeitaria e doces", "restaurante"],
  ["Buffet e eventos", "restaurante"], ["Oficina mecânica", "oficina"], ["Lava-jato e autopeças", "oficina"],
  ["Construção e reformas", "prestador"], ["Elétrica e hidráulica", "prestador"], ["Loja de roupas", "loja"],
  ["Calçados e acessórios", "loja"], ["Pet shop", "loja"], ["Fotografia", "prestador"], ["Outro ramo", "prestador"],
];

function Shot({ img, alt }: { img: Img; alt: string }) {
  return <img className="shot" src={img.src} alt={alt} loading="lazy" />;
}

export default function Funnel({ niches }: { niches: NicheData[] }) {
  const [step, setStep] = useState(1);
  const [niche, setNiche] = useState<NicheData | null>(null);
  const [model, setModel] = useState<Img | null>(null);
  const [ramo, setRamo] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);

  const ramoNome = (ramo || niche?.label || "seu negócio").toLowerCase();

  function go(url: string) {
    (window as any).fbq?.("track", "Contact");
    (window as any).ttq?.track?.("Contact");
    window.location.href = url;
  }

  function direct() {
    go(`https://wa.me/${WA}?text=${encodeURIComponent("Olá! Quero saber mais sobre o site profissional.")}`);
  }

  function choose(n: NicheData, label: string) {
    setNiche(n); setRamo(label); setModel(null); setStep(2);
  }

  function pickRamo(label: string) {
    const base = RAMOS.find((r) => r[0] === label)?.[1];
    const n = niches.find((x) => x.key === base) ?? niches.find((x) => x.key === "prestador") ?? niches[0];
    if (n) choose(n, label === "Outro ramo" ? "" : label);
  }

  function send(e: React.FormEvent) {
    e.preventDefault();
    if (!niche || !model || !name.trim()) return;
    setBusy(true);
    const q = new URLSearchParams(window.location.search);
    const source = q.get("utm_source") ?? "direto";
    fetch("/api/leads", {
      method: "POST",
      keepalive: true,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, niche: niche.key, ramo, model: model.id, channel: "whatsapp", source, campaign: q.get("utm_campaign") ?? "" }),
    }).catch(() => {});
    const msg = `Olá! Sou ${name.trim()}, vim pelo ${source}. Meu ramo é ${ramo || niche.label} e gostei do modelo ${model.label} (${niche.label}). Quero meu site.`;
    go(`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`);
  }

  const steps = ["Seu ramo", "Seu modelo", "Conversar"];

  return (
    <div className="funnel" id="escolher">
      <ol className="steps" aria-label="Etapas">
        {steps.map((s, i) => (
          <li key={s} className={step === i + 1 ? "on" : step > i + 1 ? "done" : ""}>{s}</li>
        ))}
      </ol>

      {step === 1 && (
        <>
          <h2>Qual é o seu ramo?</h2>
          <p className="sub">Toque no que mais combina com o seu negócio.</p>
          {niches.length === 0 && <p className="sub">Os modelos estão sendo preparados. <button className="link" onClick={direct}>Fale comigo no WhatsApp</button></p>}
          <div className="grid g4">
            {niches.map((n) => (
              <button key={n.id} className="pick" onClick={() => choose(n, n.label)}>
                <Shot img={n.images[0]} alt={`Exemplo de site: ${n.label}`} />
                <span>{n.label}</span>
              </button>
            ))}
          </div>
          <div className="ramo-select">
            <label>Não achou o seu? Escolha o seu ramo na lista
              <select value="" onChange={(e) => pickRamo(e.target.value)}>
                <option value="" disabled>Selecione o seu ramo</option>
                {RAMOS.map(([label]) => (<option key={label} value={label}>{label}</option>))}
              </select>
            </label>
          </div>
          <p className="alt">Prefere conversar agora? <button className="link" onClick={direct}>Fale direto comigo</button></p>
        </>
      )}

      {step === 2 && niche && (
        <>
          <h2>Escolha o modelo que mais combina com {ramoNome}</h2>
          <p className="sub">Estes são exemplos. O seu site é montado do zero, com a sua marca, as suas cores e o seu logotipo.</p>
          <div className="grid g2">
            {niche.images.map((img) => (
              <button key={img.id} className={`pick big ${model?.id === img.id ? "sel" : ""}`} aria-pressed={model?.id === img.id} onClick={() => setModel(img)}>
                <Shot img={img} alt={`${niche.label}, ${img.label}`} />
                <span><b>{img.label}</b> {img.desc}</span>
              </button>
            ))}
          </div>
          <div className="nav">
            <button className="ghost" onClick={() => setStep(1)}>Voltar</button>
            <button className="cta" disabled={!model} onClick={() => setStep(3)}>Quero este modelo</button>
          </div>
        </>
      )}

      {step === 3 && niche && model && (
        <div className="final">
          <div className="final-prev"><Shot img={model} alt={`Modelo escolhido: ${model.label}`} /></div>
          <form onSubmit={send}>
            <h2>Vamos conversar sobre o seu site</h2>
            <p className="sub">Você escolheu o modelo {model.label} para {ramoNome}. No WhatsApp eu mostro como ele fica com a sua marca. Não precisa pagar nada para começar.</p>
            <label>Seu ramo de negócio<input value={ramo} onChange={(e) => setRamo(e.target.value)} placeholder="Ex.: pet shop, dentista..." /></label>
            <label>Seu nome<input value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" /></label>
            <label>Seu WhatsApp (opcional)<input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" autoComplete="tel" placeholder="(21) 90000-0000" /></label>
            <button className="cta wide" disabled={busy || !name.trim()}>{busy ? "Abrindo o WhatsApp..." : "Continuar no WhatsApp"}</button>
            <button type="button" className="ghost" onClick={() => setStep(2)}>Trocar de modelo</button>
          </form>
        </div>
      )}
    </div>
  );
}
