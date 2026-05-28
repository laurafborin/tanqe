# TANQE

> **Negocie combustível com inteligência.**
> A plataforma B2B de leilão reverso que digitaliza a negociação de combustíveis e empodera o posto bandeira branca.

---

## Sobre o projeto

TANQE é um marketplace B2B de leilão reverso para o setor de combustíveis brasileiro. Em vez de cotar por telefone com três distribuidoras, o gestor de posto publica sua demanda e recebe lances competitivos em tempo real — com transparência, dados de mercado e rastreamento ponta a ponta da operação.

Este repositório contém a interface web da plataforma, desenvolvida como Trabalho de Conclusão de Curso na FGV-EAESP.

> **Nota:** O nome do repositório (`fuelbid`) é histórico do projeto. A marca final do produto é **TANQE**.

## Stack

- **Next.js 16** (App Router) + **TypeScript**
- **React 19**
- **Recharts** — visualização de dados
- **Leaflet** — mapas
- **Tailwind CSS** + design system próprio (tokens TANQE)
- Fontes: **Syne** (display), **DM Sans** (corpo), **DM Mono** (técnico)

## Como rodar localmente

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Como navegar

1. Acesse a landing page (`/`)
2. Clique em **Acessar plataforma**
3. Escolha um perfil de demonstração:
   - **Posto bandeira branca** (comprador) — perfil principal da plataforma
   - **Distribuidora** (vendedor) — visão complementar
4. Explore dashboards, leilões, financeiro, mapa e rastreamento de pedidos

## Estrutura

```
src/
├── app/                    # rotas Next.js (App Router)
│   ├── page.tsx            # landing pública
│   ├── login/              # seletor de perfil (mock)
│   ├── posto/              # visão do posto (protagonista)
│   └── distribuidora/      # visão da distribuidora
├── components/             # UI, layout, auction, map, charts
├── lib/                    # mock data, auth, formatadores
└── styles/                 # tokens TANQE
```

## Limitações desta versão

- Dados 100% **mock client-side** (sem backend real)
- Login de demonstração (sem autenticação real)
- Lances em tempo real são **simulados** via timer no client
- Não há persistência server-side — leilões criados ficam apenas no `localStorage`

Esta versão é um protótipo navegável de alta fidelidade para fins de demonstração acadêmica.

## Créditos

**TCC FGV-EAESP · 2025**

- Laura Ferreira Borin
- Isabela Peres P. H. Garcia
- Letícia Gabriel F. Dias

© 2025 TANQE. Todos os direitos reservados.
