## Site de Inspeção NR-13 (Next.js)

Base de site no segmento de **inspeção NR-13** (caldeiras, vasos de pressão, tubulações e tanques), com:

- Páginas públicas: Home, Serviços, Sobre, Contato, Clientes/Laudos
- **Serviços** com rota dinâmica: `src/app/servicos/[slug]`
- **Blog em MDX**: posts em `content/blog/*.mdx`
- **Área do cliente** (esqueleto para integração): `src/app/cliente/*`

> Observação: textos, contatos, nome e cores estão com **placeholders**. Assim que você enviar logo + paleta oficial e dados de contato, eu ajusto rapidamente.

## Getting Started

First, run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Onde editar as informações principais

- Nome/contatos: `src/lib/site.ts`
- Lista de serviços: `src/lib/services.ts`
- Home: `src/app/page.tsx`
- Cores (CSS vars): `src/app/globals.css`
- Posts do blog: `content/blog/*.mdx`

### Build de produção

```bash
npm run build
npm run start
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
