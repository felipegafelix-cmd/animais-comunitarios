# Animais do Bairro — MVP

Aplicação web **mobile-first** para gestão comunitária de cães e gatos de rua.

## Stack

- **Front-end:** Next.js 15 (App Router) + React + TypeScript
- **Estilização:** Tailwind CSS 4
- **Back-end / DB:** Supabase (PostgreSQL)
- **Deploy:** Vercel

## Passo 2 — Estrutura de pastas

```
animais-comunitarios/
├── docs/
│   └── DATABASE.md              # Passo 1 — documentação do schema
├── public/
│   └── manifest.json            # PWA básico (mobile)
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql
├── src/
│   ├── app/                     # Rotas Next.js (App Router)
│   │   ├── layout.tsx           # Layout raiz (pt-BR, metadata)
│   │   ├── page.tsx             # Dashboard principal (Passo 3)
│   │   ├── globals.css          # Tokens e estilos globais
│   │   └── animais/
│   │       ├── novo/page.tsx    # Cadastro (placeholder)
│   │       └── [id]/page.tsx    # Perfil (placeholder)
│   ├── components/
│   │   ├── dashboard/           # Componentes do painel
│   │   │   ├── AnimalCard.tsx
│   │   │   ├── DashboardHeader.tsx
│   │   │   ├── EmergencyAlertSection.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   └── FloatingActionButton.tsx
│   │   └── ui/
│   │       └── Badge.tsx
│   ├── lib/
│   │   ├── data/
│   │   │   ├── animals.ts       # Fetch Supabase + fallback mock
│   │   │   └── mock-animals.ts
│   │   ├── supabase/
│   │   │   ├── client.ts        # Browser client
│   │   │   └── server.ts        # Server client
│   │   └── utils/
│   │       └── feeding.ts       # Formatação de alimentação
│   └── types/
│       └── index.ts             # Tipos TypeScript do domínio
├── .env.example
├── next.config.ts
└── package.json
```

## Desenvolvimento local

```bash
npm install
cp .env.example .env.local   # opcional — sem isso roda em modo demo
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Próximas sprints

- Formulário de cadastro de animal
- Botão "Alimentei agora" no perfil
- Diário de saúde (vacinas / vermífugos)
- Toggle de emergência

Veja `docs/DEPLOY.md` para GitHub + Vercel.
