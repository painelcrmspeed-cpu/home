"use client";
import { useState } from "react";

const WA = process.env.NEXT_PUBLIC_WHATSAPP ?? "5521999999999";

export type Img = { src: string; id: string; label: string; desc: string };
export type NicheData = { id: string; key: string; label: string; images: Img[] };

// [ramo na lista, nome da pasta própria do ramo em public/modelos, pasta parecida usada enquanto a própria não existe]
const RAMOS: [string, string, string][] = [
  ["Advocacia", "advogado", "advogado"], ["Contabilidade", "contador", "contador"],
  ["Consultoria e coaching", "consultoria", "prestador"], ["Imobiliária e corretor", "imobiliaria", "prestador"],
  ["Escola e cursos", "escola", "landingpage"], ["Infoprodutos e vendas online", "landingpage", "landingpage"],
  ["Clínica médica", "medico-consultorio", "clinica"], ["Clínica geral", "clinica", "clinica"], ["Dentista", "dentista", "dentista"],
  ["Psicologia e terapia", "terapeuta", "terapeuta"], ["Fisioterapia", "terapeuta", "terapeuta"],
  ["Nutrição", "clinica", "clinica"], ["Veterinário", "veterinario", "clinica"],
  ["Salão de beleza", "barbearia", "barbearia"], ["Barbearia", "barbearia", "barbearia"],
  ["Manicure e sobrancelha", "manicure", "barbearia"], ["Estética e spa", "estetica", "terapeuta"],
  ["Academia e personal", "personal", "personal"], ["Pilates e yoga", "personal", "personal"],
  ["Restaurante e lanchonete", "restaurante", "restaurante"], ["Pizzaria", "restaurante", "restaurante"],
  ["Confeitaria e doces", "confeitaria", "restaurante"], ["Buffet e eventos", "eventos", "restaurante"],
  ["Oficina mecânica", "oficina", "oficina"], ["Lava-jato e autopeças", "oficina", "oficina"],
  ["Construção e reformas", "prestador", "prestador"], ["Elétrica e hidráulica", "prestador", "prestador"],
  ["Loja de roupas", "loja", "loja"], ["Calçados e acessórios", "loja", "loja"], ["Pet shop", "petshop", "loja"],
  ["Fotografia", "fotografia", "prestador"], ["Prestador de serviços", "prestador", "prestador"], ["Outro ramo", "prestador", "prestador"],
];

function Shot({ img, alt }: { img: Img; alt: string }) {
  return <img className="shot" src={img.src} alt={alt} loading="lazy" />;
}

export default function Funnel({ niches }: { niches: NicheData[] }) {
  const [step, setStep] = useState(1);
  const [niche, setNiche] = useState<NicheData | null>(null);
  const [model, setModel] = useState<Img | null>(null);
  const [ramo, setRamo] = useState("");
  const [generic, setGeneric] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);

  const ramoNome = (ramo || niche?.label || "seu negócio").toLowerCase();

  // lista do menu: todos os ramos conhecidos + qualquer pasta nova que você criar
  const options = [
    ...RAMOS.map(([label, key, fb]) => ({ label, key, fb })),
    ...niches.filter((n) => !RAMOS.some((r) => r[1] === n.key)).map((n) => ({ label: n.label, key: n.key, fb: n.key })),
  ].sort((a, b) => (a.label === "Outro ramo" ? 1 : b.label === "Outro ramo" ? -1 : a.label.localeCompare(b.label, "pt-BR")));

  function go(url: string) {
    (window as any).fbq?.("track", "Contact");
    (window as any).ttq?.track?.("Contact");
    window.location.href = url;
  }

  function direct() {
    go(`https://wa.me/${WA}?text=${encodeURIComponent("Olá! Quero saber mais sobre o site profissional.")}`);
  }

  function choose(n: NicheData, label: string, gen: boolean) {
    setNiche(n); setRamo(label); setGeneric(gen); setModel(null); setStep(2);
  }

  function pickRamo(label: string) {
    const o = options.find((x) => x.label === label);
    if (!o) return;
    const own = niches.find((x) => x.key === o.key);
    const sub = own ?? niches.find((x) => x.key === o.fb) ?? niches.find((x) => x.key === "prestador") ?? niches[0];
    if (!sub) return;
    const outro = label === "Outro ramo";
    choose(sub, outro ? "" : label, !own && !outro);
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
  const shown = showAll ? niches : niches.slice(0, 8);

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
          <div className="ramo-select ramo-top">
            <label>Escolha o seu ramo na lista
              <select value="" onChange={(e) => pickRamo(e.target.value)}>
                <option value="" disabled>Selecione o seu ramo</option>
                {options.map((o) => (<option key={o.label} value={o.label}>{o.label}</option>))}
              </select>
            </label>
          </div>
          <p className="or">ou toque em um dos modelos {showAll ? "disponíveis" : "mais procurados"}</p>
          {niches.length === 0 && <p className="sub">Os modelos estão sendo preparados. <button className="link" onClick={direct}>Fale comigo no WhatsApp</button></p>}
          <div className="grid g4">
            {shown.map((n) => (
              <button key={n.id} className="pick" onClick={() => choose(n, n.label, false)}>
                <Shot img={n.images[0]} alt={`Exemplo de site: ${n.label}`} />
                <span>{n.label}</span>
              </button>
            ))}
          </div>
          {niches.length > 8 && (
            <p className="alt"><button className="link" onClick={() => setShowAll(!showAll)}>{showAll ? "Mostrar menos" : `Ver todos os ${niches.length} ramos com modelos`}</button></p>
          )}
          <p className="alt">Prefere conversar agora? <button className="link" onClick={direct}>Fale direto comigo</button></p>
        </>
      )}

      {step === 2 && niche && (
        <>
          <h2>Escolha o modelo que mais combina com {ramoNome}</h2>
          <p className="sub">Estes são exemplos. O seu site é montado do zero, com a sua marca, as suas cores e o seu logotipo.</p>
          {generic && (
            <p className="notice">Estamos criando modelos exclusivos para <b>{ramo}</b>. Por enquanto, veja exemplos de um ramo parecido, que mostram o nível do trabalho. Escolha o que mais gostou e chame no WhatsApp: o seu será feito sob medida para o seu negócio.</p>
          )}
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
