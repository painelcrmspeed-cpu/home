import type { Metadata } from "next";
import "../site-profissional/site-profissional.css";

export const metadata: Metadata = { title: "Política de privacidade", alternates: { canonical: "/privacidade" } };
const WA = process.env.NEXT_PUBLIC_WHATSAPP ?? "5521999999999";

export default function Privacidade() {
  return (
    <main className="sp legal">
      <div className="wrap narrow">
        <h1>Política de privacidade</h1>
        <p>Última atualização: 24/10/2026.</p>
        <h2>Quais dados coletamos</h2>
        <p>Quando você usa esta página, podemos receber o seu nome, e-mail, telefone, ramo de negócio, a mensagem que você escrever, o modelo de site que escolheu e a origem do seu acesso (por exemplo, Instagram ou TikTok).</p>
        <h2>Para que usamos</h2>
        <p>Usamos esses dados só para responder ao seu contato, enviar proposta e prestar o serviço combinado. Não vendemos os seus dados.</p>
        <h2>Com quem compartilhamos</h2>
        <p>Usamos serviços de terceiros para guardar os contatos e enviar e-mails (Supabase e Resend). Também podemos usar os pixels da Meta e do TikTok para medir a eficiência de anúncios, e eles podem usar cookies.</p>
        <h2>Por quanto tempo guardamos</h2>
        <p>Guardamos o contato pelo tempo necessário para o atendimento e para cumprir obrigações legais. Você pode pedir a exclusão a qualquer momento.</p>
        <h2>Seus direitos (LGPD)</h2>
        <p>Você pode pedir acesso, correção ou exclusão dos seus dados. Fale conosco pelo <a href={`https://wa.me/${WA}`}>WhatsApp</a>.</p>
        <p><a href="/">Voltar para a página inicial</a></p>
      </div>
    </main>
  );
}
