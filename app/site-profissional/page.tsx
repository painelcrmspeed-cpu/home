import type { Metadata } from "next";
import fs from "node:fs";
import path from "node:path";
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";
import Funnel, { type NicheData } from "./Funnel";
import ContactForm from "./ContactForm";
import "./site-profissional.css";

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--f-display" });
const body = DM_Sans({ subsets: ["latin"], variable: "--f-body" });
const WA = process.env.NEXT_PUBLIC_WHATSAPP ?? "5521999999999";
const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.mundohoje.online";
const NAME = "Mundo Hoje"; // troque pelo nome da sua marca

const TITLE = "Criação de Sites Profissionais | Prazos de 7 a 15 dias";
const DESC = "Site institucional, profissional ou dinâmico com logotipo grátis. Escolha o seu ramo, veja modelos prontos e fale comigo no WhatsApp. Sem pagar para começar a conversa.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: TITLE,
  description: DESC,
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: { type: "website", locale: "pt_BR", url: "/", siteName: NAME, title: TITLE, description: DESC, images: [{ url: "/og.png", width: 1200, height: 630, alt: "Criação de sites profissionais" }] },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC, images: ["/og.png"] },
};

const PLANS = [
  { n: "Essencial", p: "R$ 400", prazo: "Pronto em até 7 dias", hi: false, itens: ["Até 4 páginas simples, ou 1 página com até 5 seções", "Site responsivo (celular e computador)", "Botão de WhatsApp e SEO básico", "Formulário de contato por e-mail", "Logotipo grátis", "Conectamos o seu domínio"] },
  { n: "Profissional", p: "a partir de R$ 600", prazo: "Pronto em até 10 dias", hi: true, itens: ["Até 5 páginas, com blog ou portfólio", "Formulário com e-mail automático", "Google Analytics e SEO", "Logotipo grátis", "Conectamos o seu domínio", "15 dias de manutenção grátis após a entrega"] },
  { n: "Dinâmico", p: "a partir de R$ 2.000", prazo: "Pronto em até 15 dias", hi: false, itens: ["Tudo do Profissional", "Painel administrativo, banco de dados e login", "Conteúdo que você mesmo edita", "Logotipo grátis", "Domínio grátis", "30 dias de manutenção grátis após a entrega"] },
];

const MAINT = [
  ["Essencial", "R$ 50/mês", "2 alterações", "-"],
  ["Profissional", "R$ 60/mês", "5 alterações", "15 dias"],
  ["Dinâmico", "R$ 120/mês", "10 alterações", "30 dias"],
];

const STEPS = [
  ["Você escolhe", "Ramo e modelo, em 1 minuto, aqui na página."],
  ["A gente conversa", "No WhatsApp, sem compromisso: entendo o seu negócio e envio a proposta com valor e prazo."],
  ["Você acompanha", "Aprovada a proposta, eu monto o site e você vê a prévia num link para testar."],
  ["Site no ar", "Você aprova, publicamos e conectamos o seu domínio."],
];

const WAY = [
  ["Conversa sem compromisso", "Você escolhe o modelo e fala comigo. O pagamento só entra depois que você aprova a proposta."],
  ["O site é seu", "O domínio fica no seu nome e o projeto não fica preso comigo."],
  ["Prazos claros", "Cada pacote tem o seu prazo, combinado por escrito antes de começar."],
  ["Suporte depois da entrega", "Profissional tem 15 dias de manutenção grátis e Dinâmico tem 30."],
];

const FAQ = [
  ["Preciso pagar antes de conversar?", "Não. Primeiro conversamos pelo WhatsApp, eu mostro como o modelo fica com a sua marca e envio a proposta. O pagamento só entra depois que você aprova."],
  ["Em quanto tempo fica pronto?", "Essencial em até 7 dias, Profissional em até 10 e Dinâmico em até 15. O prazo começa quando a proposta é aprovada e você envia textos e fotos."],
  ["O domínio está incluso?", "No Dinâmico, o domínio é grátis. No Essencial e no Profissional, você registra o seu (.com, .com.br, .net) no seu nome, eu ajudo a escolher e conecto ao site."],
  ["O logotipo é cobrado?", "Não. Todos os pacotes incluem logotipo, com 2 opções e 1 rodada de ajustes."],
  ["Como funciona a manutenção?", "Profissional tem 15 dias grátis após a entrega e Dinâmico tem 30. Depois, você pode assinar: Essencial R$ 50/mês (2 alterações), Profissional R$ 60/mês (5) e Dinâmico R$ 120/mês (10)."],
  ["Tenho um supermercado ou loja com mudanças todo dia.", "Nesse caso o atendimento é por contrato personalizado. Fale comigo pelo WhatsApp ou pelo formulário no fim da página."],
  ["Posso falar com você sem usar o WhatsApp?", "Sim. Use o formulário no fim da página e eu respondo por e-mail ou telefone."],
];

// ---- Lê a pasta public/modelos na hora do build: cada pasta é um ramo, cada imagem é um modelo.
const IMG = /\.(webp|png|jpe?g|avif)$/i;
const slug = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const LABELS: Record<string, string> = {
  landingpage: "Página de vendas", prestador: "Prestador de serviços", advogado: "Advocacia", "medico-consultorio": "Médico e consultório",
  medico: "Médico e consultório", dentista: "Dentista", clinica: "Clínica", terapeuta: "Terapeuta", personal: "Personal trainer",
  barbearia: "Barbearia e salão", restaurante: "Restaurante", loja: "Loja de roupas", oficina: "Oficina mecânica", contador: "Contabilidade",
};
const ORDER = Object.keys(LABELS);
const LAYOUTS: Record<string, [string, string]> = {
  classico: ["Clássico", "Texto e imagem lado a lado. Passa confiança."],
  vitrine: ["Vitrine", "Seus serviços em destaque logo na abertura."],
  impacto: ["Impacto", "Abertura escura e grande, feita para marcar."],
  minimal: ["Minimal", "Muito espaço e tipografia. Elegante e leve."],
};
const humanize = (s: string) => { const t = s.replace(/[-_]+/g, " ").trim(); return t.charAt(0).toUpperCase() + t.slice(1); };

function loadNiches(): NicheData[] {
  const root = path.join(process.cwd(), "public", "modelos");
  if (!fs.existsSync(root)) return [];
  const list: NicheData[] = [];
  for (const d of fs.readdirSync(root, { withFileTypes: true })) {
    if (!d.isDirectory() || d.name.startsWith("_")) continue;
    const files = fs.readdirSync(path.join(root, d.name)).filter((f) => IMG.test(f)).sort((a, b) => a.localeCompare(b, "pt-BR", { numeric: true }));
    if (files.length === 0) continue;
    const key = slug(d.name);
    list.push({
      id: d.name,
      key,
      label: LABELS[key] ?? humanize(d.name),
      images: files.map((f, i) => {
        const id = f.replace(/\.[^.]+$/, "");
        const lay = LAYOUTS[slug(id)];
        return { src: `/modelos/${encodeURIComponent(d.name)}/${encodeURIComponent(f)}`, id, label: lay ? lay[0] : `Modelo ${i + 1}`, desc: lay ? lay[1] : "" };
      }),
    });
  }
  const rank = (k: string) => { const i = ORDER.indexOf(k); return i < 0 ? 99 : i; };
  return list.sort((a, b) => rank(a.key) - rank(b.key) || a.label.localeCompare(b.label, "pt-BR"));
}

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "ProfessionalService", name: NAME, url: SITE, areaServed: "BR", description: DESC, priceRange: "R$ 400 a R$ 3.500" },
    { "@type": "FAQPage", mainEntity: FAQ.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) },
  ],
};

export default function Page() {
  return (
    <main className={`sp ${display.variable} ${body.variable}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="hero">
        <h1>Seu site profissional no ar em menos de uma semana</h1>
        <p>Escolha seu ramo, veja modelos prontos e fale comigo no WhatsApp. Logotipo grátis em todos os pacotes.</p>
        <p className="prazos"><span>Essencial: até 7 dias</span><span>Profissional: até 10 dias</span><span>Dinâmico: até 15 dias</span></p>
      </header>

      <section className="wrap"><Funnel niches={loadNiches()} /></section>

      <section className="wrap block">
        <h2>Como funciona</h2>
        <ol className="how">
          {STEPS.map(([t, d], i) => (<li key={t}><b>{i + 1}. {t}</b><span>{d}</span></li>))}
        </ol>
      </section>

      <section className="wrap block" id="pacotes">
        <h2>Pacotes e prazos</h2>
        <div className="grid g3">
          {PLANS.map((p) => (
            <article key={p.n} className={`plan ${p.hi ? "hi" : ""}`}>
              {p.hi && <small>Mais escolhido</small>}
              <h3>{p.n}</h3><strong>{p.p}</strong><span className="prazo">{p.prazo}</span>
              <ul>{p.itens.map((i) => (<li key={i}>{i}</li>))}</ul>
            </article>
          ))}
        </div>
        <p className="fine">O prazo começa quando a proposta é aprovada e você envia textos e fotos. O registro do domínio (.com, .com.br, .net) é pago por você nos pacotes Essencial e Profissional.</p>
        <div className="custom">
          <p><b>Supermercado ou loja com alterações todos os dias?</b> Fazemos contrato personalizado, com atendimento e manutenção sob medida.</p>
          <a href={`https://wa.me/${WA}?text=${encodeURIComponent("Olá! Tenho uma loja e preciso de um contrato personalizado.")}`}>Pedir contrato personalizado</a>
        </div>
      </section>

      <section className="wrap block">
        <h2>Manutenção depois da entrega</h2>
        <div className="mwrap">
          <table className="mtable">
            <thead><tr><th>Pacote</th><th>Mensalidade</th><th>Alterações por mês</th><th>Grátis após a entrega</th></tr></thead>
            <tbody>{MAINT.map(([a, b, c, d]) => (<tr key={a}><td><b>{a}</b></td><td>{b}</td><td>{c}</td><td>{d}</td></tr>))}</tbody>
          </table>
        </div>
        <p className="fine">Planos semestral e anual com desconto, combinados na conversa.</p>
      </section>

      <section className="wrap block">
        <h2>Como eu trabalho com você</h2>
        <div className="way">
          {WAY.map(([t, d]) => (<div key={t}><b>{t}</b><span>{d}</span></div>))}
        </div>
      </section>

      <section className="wrap block narrow">
        <h2>Perguntas frequentes</h2>
        {FAQ.map(([q, a]) => (<details key={q}><summary>{q}</summary><p>{a}</p></details>))}
      </section>

      <section className="wrap block narrow" id="contato">
        <h2>Prefere não usar o WhatsApp?</h2>
        <p className="sub">Deixe a sua mensagem e eu respondo por e-mail ou telefone.</p>
        <ContactForm />
      </section>

      <footer className="foot">© {new Date().getFullYear()} {NAME} · <a href="/privacidade">Política de privacidade</a></footer>

      <a className="wa-float" href={`https://wa.me/${WA}?text=${encodeURIComponent("Olá! Quero saber mais sobre o site profissional.")}`} aria-label="Falar no WhatsApp">WhatsApp</a>
    </main>
  );
}
