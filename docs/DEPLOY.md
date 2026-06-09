# Passo 4 — GitHub + Deploy contínuo na Vercel

## 1. Preparar o Supabase (antes do deploy)

1. Acesse [supabase.com](https://supabase.com) e crie um projeto
2. Em **SQL Editor**, execute `supabase/migrations/001_initial_schema.sql`
3. Em **Project Settings → API**, copie:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 2. Conectar ao GitHub

```bash
# Na pasta do projeto
cd C:\Users\felip\Projects\animais-comunitarios

# Primeiro commit (se ainda não fez)
git add .
git commit -m "feat: MVP dashboard gestão de animais comunitários"

# Crie um repositório vazio no GitHub (sem README) e conecte:
git remote add origin https://github.com/SEU_USUARIO/animais-comunitarios.git
git branch -M main
git push -u origin main
```

> **Dica:** use `gh repo create animais-comunitarios --public --source=. --push` se tiver o [GitHub CLI](https://cli.github.com/) instalado.

## 3. Deploy na Vercel

1. Acesse [vercel.com](https://vercel.com) e faça login com GitHub
2. Clique em **Add New → Project**
3. Importe o repositório `animais-comunitarios`
4. A Vercel detecta Next.js automaticamente — **não altere** Build Command (`next build`) nem Output Directory
5. Em **Environment Variables**, adicione:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Clique em **Deploy**

## 4. Deploy contínuo (CI/CD)

Após a primeira configuração, **cada push na branch `main`** dispara um novo deploy automaticamente:

```
git add .
git commit -m "feat: adiciona perfil do animal"
git push origin main
```

A Vercel builda, roda `next build` e publica a nova versão em ~1–2 minutos.

## 5. Preview deployments

Pull requests geram URLs de preview únicas — ideal para revisar mudanças antes de mergear em `main`.

## 6. Checklist pós-deploy

- [ ] Dashboard carrega em `/` no domínio `.vercel.app`
- [ ] Variáveis de ambiente configuradas (sem banner "modo demonstração")
- [ ] Schema SQL aplicado no Supabase
- [ ] Teste no celular (layout mobile-first)

## Comandos úteis

```bash
npm run build    # valida build de produção localmente
npm run start    # serve build de produção
npm run lint     # ESLint
```

## Domínio customizado (opcional)

Em **Vercel → Project → Settings → Domains**, adicione seu domínio e siga as instruções de DNS.
