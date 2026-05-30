# CRMSPEED — Frontend Institucional

Landing page institucional do **CRMSPEED**, plataforma SaaS de CRM para equipes comerciais e revendedores.

---

## Stack

- HTML5 semântico (acessibilidade ARIA completa)
- CSS3 modular (sem frameworks externos)
- JavaScript vanilla (ES6+, sem dependências)
- Fontes: Syne + DM Sans + JetBrains Mono via Google Fonts
- Preparado para migração para React/Next.js

---

## Estrutura do Projeto

```
crm-front-end/
│
├── index.html              # Ponto de entrada — todas as seções inline
├── README.md
├── .gitignore
│
├── assets/
│   ├── images/             # Imagens (og-image.jpg, screenshots)
│   ├── icons/              # favicon.svg e ícones
│   └── fonts/              # Fontes locais (opcional)
│
├── css/
│   ├── style.css           # Entrada principal — importa todos os módulos
│   ├── variables.css       # Design tokens (cores, tipografia, espaçamentos)
│   ├── reset.css           # Reset profissional
│   ├── layout.css          # Containers, grid, section helpers
│   ├── components.css      # Botões, cards, navbar, hero, seções, footer
│   └── responsive.css      # Media queries mobile-first
│
├── js/
│   ├── main.js             # Inicialização — DOMContentLoaded
│   ├── menu.js             # MenuController — mobile nav + scroll hide
│   └── animations.js       # AnimationController — scroll reveal, FAQ, pricing toggle
│
├── sections/               # Seções como fragmentos HTML independentes
│   ├── hero.html
│   ├── features.html
│   ├── pricing.html
│   ├── testimonials.html
│   ├── faq.html
│   └── footer.html
│
└── components/             # Componentes reutilizáveis
    ├── navbar.html
    ├── button.html
    └── card.html
```

---

## Git — Inicialização

```bash
cd C:\crm-front-end

git init
git add .
git commit -m "feat: estrutura inicial CRMSPEED frontend"
```

### Conectar ao GitHub

```bash
git remote add origin https://github.com/SEU_USUARIO/crmspeed-frontend.git
git branch -M main
git push -u origin main
```

---

## Deploy — Vercel

### Opção 1: Via CLI

```bash
npm i -g vercel
vercel
```

Siga o assistente. Vercel detecta HTML estático automaticamente.

### Opção 2: Via Dashboard

1. Acesse [vercel.com](https://vercel.com)
2. Clique em **Add New Project**
3. Importe o repositório GitHub
4. Framework Preset: **Other**
5. Output Directory: `.` (raiz)
6. Clique em **Deploy**

### Variáveis de Ambiente

Nenhuma variável de ambiente é necessária para o frontend estático.

---

## Arquitetura da Aplicação

### Princípios

- **Mobile-first**: Todos os breakpoints partem do mobile e expandem
- **Zero dependências externas**: Sem Bootstrap, Tailwind, jQuery
- **CSS modular**: Cada arquivo tem responsabilidade única
- **JavaScript modular**: Padrão IIFE com escopo isolado
- **Acessibilidade**: ARIA labels, roles, focus-visible, skip links
- **Performance**: CSS custom properties, IntersectionObserver, passive scroll

### Design System

| Token | Valor |
|-------|-------|
| `--bg-primary` | `#020617` |
| `--bg-card` | `#0F172A` |
| `--accent` | `#22D3EE` |
| `--text-primary` | `#FFFFFF` |
| `--text-secondary` | `#CBD5E1` |
| `--font-display` | Syne |
| `--font-body` | DM Sans |

### Migração para React/Next.js

A estrutura está preparada para migração:

- Seções em `/sections/*.html` → componentes React em `/components/*.tsx`
- CSS modules por componente
- `variables.css` → `globals.css` ou Tailwind config
- `MenuController` → `useMenu()` hook
- `AnimationController` → `useScrollReveal()` hook

---

## Desenvolvimento Local

Abra `index.html` diretamente no navegador ou use um servidor local:

```bash
# Python
python -m http.server 3000

# Node (http-server)
npx http-server -p 3000

# VS Code: instale a extensão Live Server
```

---

## Próximos Passos

- [ ] Adicionar `og-image.jpg` em `/assets/images/`
- [ ] Integrar formulário de captura de leads
- [ ] Implementar seção Revendedores
- [ ] Conectar analytics (GA4 / Plausible)
- [ ] Configurar domínio customizado na Vercel
- [ ] Migrar para Next.js App Router
