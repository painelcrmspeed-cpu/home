import type { Metadata } from "next";
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";
import fs from "node:fs";
import path from "node:path";
import Funnel, { type NicheData } from "./Funnel";
import "./site-profissional.css";

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--f-display" });
const body = DM_Sans({ subsets: ["latin"], variable: "--f-body" });
const WA = process.env.NEXT_PUBLIC_WHATSAPP ?? "5521999999999";

export const metadata: Metadata = {
  title: "Seu site profissional no ar em menos de uma semana",
  description: "Escolha seu ramo, veja 4 modelos de site e fale direto comigo. Logotipo grátis em todos os pacotes.",
};

const PLANS = [
  { n: "Essencial", p: "R$ 400", d: "Até 4 páginas simples, ou 1 página com até 5 seções. Botão de WhatsApp, SEO básico e formulário de contato.", hi: false },
  { n: "Profissional", p: "a partir de R$ 600", d: "Até 5 páginas, blog ou portfólio, e-mail automático do formulário, Google Analytics e domínio conectado.", hi: true },
  { n: "Dinâmico", p: "a partir de R$ 2.000", d: "Tudo do Profissional, com painel administrativo, login e conteúdo que você mesmo edita.", hi: false },
];

const STEPS = [
  ["Você escolhe", "Ramo e modelo, em 1 minuto, aqui na página."],
  ["A gente conversa", "No WhatsApp, sem compromisso, para entender seu negócio."],
  ["Você vê a prévia", "Em poucos dias, com a sua marca, num link para testar."],
  ["Site no ar", "Você aprova, paga e publicamos. O domínio fica no seu nome."],
];

const WAY = [
  ["Tudo no seu nome", "GitHub, Vercel, Supabase, Resend e domínio são criados com o seu e-mail e o seu celular."],
  ["Sem prender você", "O código, o domínio e os acessos são seus. Se quiser seguir sozinho, é só me remover da conta."],
  ["Plano pago só quando precisa", "Site de negócio na Vercel pede o plano Pro. Eu explico antes, e você assina direto na sua conta."],
  ["Eu cuido da parte técnica", "Eu monto, publico e deixo funcionando. Você não precisa saber programar."],
];

const SUBS = [
  { n: "Manutenção do site", p: "a partir de R$ 79/mês", d: "Ajustes pequenos, troca de textos e fotos, monitoramento e suporte pelo WhatsApp.", t: "Para sites institucionais" },
  { n: "Loja e sistemas", p: "a partir de R$ 149/mês", d: "Tudo da manutenção, mais correções, atualizações, cuidado com o banco de dados e suporte com prioridade.", t: "Para lojas, painéis e sites dinâmicos" },
];

const FAQ = [
  ["Eu preciso ter conta na Vercel e no GitHub?", "Sim, no seu nome. Eu te guio na criação, e você me convida para trabalhar no projeto. O site nunca fica preso comigo."],
  ["Como funciona a assinatura?", "É opcional para sites simples e recomendada para lojas e sistemas. Você escolhe pagar por mês, por semestre ou por ano, e os planos maiores têm desconto."],
  ["Preciso pagar antes de conversar?", "Não. Primeiro a conversa e a prévia. O pagamento entra depois que você aprova a proposta."],
  ["Em quanto tempo fica pronto?", "Menos de uma semana, contando a partir do dia em que você me envia textos e fotos."],
  ["O domínio está incluso?", "Não. Você registra o seu (.com, .com.br, .net) no seu nome e eu ajudo a escolher e configurar."],
  ["O logotipo é cobrado?", "Não. Todos os pacotes incluem logotipo, com 2 opções e 1 rodada de ajustes."],
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
        return {
          src: `/modelos/${encodeURIComponent(d.name)}/${encodeURIComponent(f)}`,
          id,
          label: lay ? lay[0] : `Modelo ${i + 1}`,
          desc: lay ? lay[1] : "",
        };
      }),
    });
  }
  const rank = (k: string) => { const i = ORDER.indexOf(k); return i < 0 ? 99 : i; };
  return list.sort((a, b) => rank(a.key) - rank(b.key) || a.label.localeCompare(b.label, "pt-BR"));
}

export default function Page() {
  return (
    <main className={`sp ${display.variable} ${body.variable}`}>
      <header className="hero">
        <h1>Seu site profissional no ar em menos de uma semana</h1>
        <p>Escolha seu ramo, veja 4 modelos e fale comigo no WhatsApp. Logotipo grátis em todos os pacotes.</p>
      </header>

      <section className="wrap"><Funnel niches={loadNiches()} /></section>

      <section className="wrap block">
        <h2>Como funciona</h2>
        <ol className="how">
          {STEPS.map(([t, d], i) => (<li key={t}><b>{i + 1}. {t}</b><span>{d}</span></li>))}
        </ol>
      </section>

      <section className="wrap block">
        <h2>Pacotes</h2>
        <div className="grid g3">
          {PLANS.map((p) => (
            <article key={p.n} className={`plan ${p.hi ? "hi" : ""}`}>
              {p.hi && <small>Mais escolhido</small>}
              <h3>{p.n}</h3><strong>{p.p}</strong><p>{p.d}</p>
            </article>
          ))}
        </div>
        <p className="note">Logotipo grátis em todos. Domínio pago por você, em separado, no seu nome.</p>
      </section>

      <section className="wrap block">
        <h2>Como eu trabalho com você</h2>
        <div className="way">
          {WAY.map(([t, d]) => (<div key={t}><b>{t}</b><span>{d}</span></div>))}
        </div>
      </section>

      <section className="wrap block">
        <h2>Manutenção por assinatura</h2>
        <div className="subs">
          {SUBS.map((s) => (
            <article key={s.n} className="sub-card">
              <small>{s.t}</small><h3>{s.n}</h3><strong>{s.p}</strong><p>{s.d}</p>
            </article>
          ))}
        </div>
        <div className="cycles"><span>Mensal</span><span>Semestral, com 10% de desconto</span><span>Anual, com 20% de desconto</span></div>
      </section>

      <section className="wrap block narrow">
        <h2>Perguntas frequentes</h2>
        {FAQ.map(([q, a]) => (<details key={q}><summary>{q}</summary><p>{a}</p></details>))}
      </section>

      <a className="wa-float" href={`https://wa.me/${WA}?text=${encodeURIComponent("Olá! Quero saber mais sobre o site profissional.")}`} aria-label="Falar no WhatsApp">WhatsApp</a>
    </main>
  );
}
