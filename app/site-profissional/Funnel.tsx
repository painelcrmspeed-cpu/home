"use client";
import { useState } from "react";

const WA = process.env.NEXT_PUBLIC_WHATSAPP ?? "5521999999999";

type Niche = { id: string; label: string; biz: string; tag: string; bg: string; ink: string; ac: string };

const NICHES: Niche[] = [
  { id: "advogado", label: "Advocacia", biz: "Moreira & Lima", tag: "Defesa clara para quem precisa", bg: "#F3EFE6", ink: "#1B2A41", ac: "#B08D57" },
  { id: "clinica", label: "Clínica e dentista", biz: "Clínica Sorrir", tag: "Cuidado que você sente", bg: "#EAF6F6", ink: "#0F3D4A", ac: "#1FA5A0" },
  { id: "personal", label: "Personal trainer", biz: "Treino Forte", tag: "Seu corpo em 12 semanas", bg: "#101820", ink: "#FFFFFF", ac: "#C6F432" },
  { id: "barbearia", label: "Barbearia e salão", biz: "Navalha Club", tag: "Corte feito com calma", bg: "#1E1B1A", ink: "#F2E8DC", ac: "#D4A24C" },
  { id: "restaurante", label: "Restaurante", biz: "Casa do Forno", tag: "Comida de verdade, mesa cheia", bg: "#FFF4E5", ink: "#3B1F12", ac: "#D9480F" },
  { id: "oficina", label: "Oficina mecânica", biz: "Auto Centro Silva", tag: "Seu carro de volta no mesmo dia", bg: "#E9ECEF", ink: "#1D2B36", ac: "#F59F00" },
  { id: "contador", label: "Contabilidade", biz: "Contábil Prime", tag: "Seu CNPJ em dia, sem susto", bg: "#EDF2FB", ink: "#14264B", ac: "#2F6BFF" },
  { id: "loja", label: "Loja de roupas", biz: "Atelier Rosa", tag: "Coleção nova toda semana", bg: "#FDEDF1", ink: "#3A1626", ac: "#E64980" },
];

const MODELS = [
  { id: "classico", label: "Clássico", desc: "Texto e imagem lado a lado. Passa confiança." },
  { id: "vitrine", label: "Vitrine", desc: "Seus serviços em destaque logo na abertura." },
  { id: "impacto", label: "Impacto", desc: "Abertura escura e grande, feita para marcar." },
  { id: "minimal", label: "Minimal", desc: "Muito espaço e tipografia. Elegante e leve." },
];

const RAMOS: [string, string][] = [
  ["Advocacia", "advogado"], ["Contabilidade", "contador"], ["Consultoria e coaching", "contador"], ["Imobiliária e corretor", "contador"],
  ["Escola e cursos", "contador"], ["Clínica médica", "clinica"], ["Dentista", "clinica"], ["Psicologia e terapia", "clinica"],
  ["Fisioterapia", "clinica"], ["Nutrição", "clinica"], ["Veterinário", "clinica"], ["Salão de beleza", "barbearia"],
  ["Barbearia", "barbearia"], ["Manicure e sobrancelha", "barbearia"], ["Estética e spa", "barbearia"], ["Academia e personal", "personal"],
  ["Pilates e yoga", "personal"], ["Restaurante e lanchonete", "restaurante"], ["Pizzaria", "restaurante"], ["Confeitaria e doces", "restaurante"],
  ["Buffet e eventos", "restaurante"], ["Oficina mecânica", "oficina"], ["Lava-jato e autopeças", "oficina"], ["Construção e reformas", "oficina"],
  ["Elétrica e hidráulica", "oficina"], ["Loja de roupas", "loja"], ["Calçados e acessórios", "loja"], ["Pet shop", "loja"],
  ["Fotografia", "loja"], ["Outro ramo", "contador"],
];

function Shot({ n, m }: { n: Niche; m: string }) {
  return (
    <img
      className="shot"
      src={`/modelos/${n.id}/${m}.webp`}
      alt={`Exemplo de site de ${n.label}, modelo ${m}`}
      width={960}
      height={600}
      loading="lazy"
    />
  );
}

export default function Funnel() {
  const [step, setStep] = useState(1);
  const [niche, setNiche] = useState<Niche | null>(null);
  const [model, setModel] = useState<string | null>(null);
  const [ramo, setRamo] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);

  const ramoNome = ramo || niche?.label || "";

  function pickRamo(label: string) {
    const base = RAMOS.find((r) => r[0] === label)?.[1];
    const n = NICHES.find((x) => x.id === base);
    if (!n) return;
    setNiche(n); setRamo(label === "Outro ramo" ? "" : label); setModel(null); setStep(2);
  }

  const modelLabel = MODELS.find((x) => x.id === model)?.label ?? "";

  function go(url: string) {
    (window as any).fbq?.("track", "Contact");
    (window as any).ttq?.track?.("Contact");
    window.location.href = url;
  }

  function direct() {
    go(`https://wa.me/${WA}?text=${encodeURIComponent("Olá! Quero saber mais sobre o site profissional.")}`);
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
      body: JSON.stringify({ name, phone, niche: niche.id, ramo, model, source, campaign: q.get("utm_campaign") ?? "" }),
    }).catch(() => {});
    const msg = `Olá! Sou ${name.trim()}, vim pelo ${source}. Meu ramo é ${ramo || niche.label} e gostei do modelo ${modelLabel}. Quero meu site.`;
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
          <div className="grid g4">
            {NICHES.map((n) => (
              <button key={n.id} className="pick" onClick={() => { setNiche(n); setRamo(n.label); setModel(null); setStep(2); }}>
                <Shot n={n} m="classico" />
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
          <p className="alt">Seu ramo não está aqui? <button className="link" onClick={direct}>Fale direto comigo</button></p>
        </>
      )}

      {step === 2 && niche && (
        <>
          <h2>Escolha um dos 4 modelos para {(ramoNome || "seu negócio").toLowerCase()}</h2>
          <p className="sub">Estes são exemplos. O seu site é montado do zero, com a sua marca, as suas cores e o seu logotipo.</p>
          <div className="grid g2">
            {MODELS.map((m) => (
              <button key={m.id} className={`pick big ${model === m.id ? "sel" : ""}`} aria-pressed={model === m.id} onClick={() => setModel(m.id)}>
                <Shot n={niche} m={m.id} />
                <span><b>{m.label}</b> {m.desc}</span>
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
          <div className="final-prev"><Shot n={niche} m={model} /></div>
          <form onSubmit={send}>
            <h2>Vamos conversar sobre o seu site</h2>
            <p className="sub">Você escolheu o modelo {modelLabel} para {(ramoNome || "seu negócio").toLowerCase()}. No WhatsApp eu mostro como ele fica com a sua marca. Não precisa pagar nada para começar.</p>
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
