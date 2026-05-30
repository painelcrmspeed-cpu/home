# CRMSPEED — MVP Comercial do Site

Esta versão transforma a landing page em uma página comercial funcional para a fase atual do projeto:

- Venda direta do CRM para cliente final
- Captação de candidatos a revendedor
- Explicação clara da operação CRMSPEED → Bolten
- Links operacionais para a plataforma atual
- Formulários sem backend que abrem WhatsApp com mensagem pronta

## Arquivos alterados

- `index.html`
- `js/main.js`
- `css/components.css`

## Ajuste obrigatório antes de publicar

Abra `js/main.js` e troque:

```js
whatsappNumber: '5521999999999'
```

pelo WhatsApp comercial real da CRMSPEED, usando somente números.

Exemplo:

```js
whatsappNumber: '55219988887777'
```

## Como funciona o formulário agora

Como o site ainda é estático e não tem banco/backend, o formulário:

1. Captura os dados digitados
2. Monta uma mensagem organizada
3. Abre o WhatsApp da CRMSPEED
4. Salva uma cópia local no navegador em `localStorage`

Quando o Supabase/Auth estiver pronto, o próximo passo é substituir esse envio por uma API real:

- `/api/leads`
- tabela `public_leads`
- painel admin para aprovar cliente ou revendedor
- envio de email/WhatsApp automático

## Próxima etapa técnica recomendada

Depois de publicar essa versão, a prioridade continua sendo o painel de parceiros:

1. Supabase Auth
2. Tabela `users`
3. Roles `admin | reseller | client`
4. Middleware protegendo rotas
5. RLS real
6. Cada revendedor vendo apenas seus clientes
