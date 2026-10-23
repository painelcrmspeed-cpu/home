import type { Metadata } from "next";
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";
import Funnel from "./Funnel";
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

const FAQ = [
  ["Preciso pagar antes de conversar?", "Não. Primeiro a conversa e a prévia. O pagamento entra depois que você aprova a proposta."],
  ["Em quanto tempo fica pronto?", "Menos de uma semana, contando a partir do dia em que você me envia textos e fotos."],
  ["O domínio está incluso?", "Não. Você registra o seu (.com, .com.br, .net) no seu nome e eu ajudo a escolher e configurar."],
  ["O logotipo é cobrado?", "Não. Todos os pacotes incluem logotipo, com 2 opções e 1 rodada de ajustes."],
];

export default function Page() {
  return (
    <main className={`sp ${display.variable} ${body.variable}`}>
      <header className="hero">
        <h1>Seu site profissional no ar em menos de uma semana</h1>
        <p>Escolha seu ramo, veja 4 modelos e fale comigo no WhatsApp. Logotipo grátis em todos os pacotes.</p>
      </header>

      <section className="wrap"><Funnel /></section>

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

      <section className="wrap block narrow">
        <h2>Perguntas frequentes</h2>
        {FAQ.map(([q, a]) => (<details key={q}><summary>{q}</summary><p>{a}</p></details>))}
      </section>

      <a className="wa-float" href={`https://wa.me/${WA}?text=${encodeURIComponent("Olá! Quero saber mais sobre o site profissional.")}`} aria-label="Falar no WhatsApp">WhatsApp</a>
    </main>
  );
}
