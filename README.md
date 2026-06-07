# Nortend site

Landing page institucional da **Nortend Engenharia e Inspeção** (NR-13) com um
painel de administração para editar textos e trocar imagens sem precisar mexer
em código.

- **Stack:** Node.js + Express + EJS (renderização no servidor)
- **Deploy:** PM2 + Nginx + Let's Encrypt (ver [`DEPLOY.md`](./DEPLOY.md))
- **Domínio:** nortendengenharia.com.br
- **Por que conteúdo é editado em produção (e não por push):** ver [`ARQUITETURA.md`](./ARQUITETURA.md)

## Antes de publicar (preencher pelo `/admin`)

O conteúdo já vem preenchido com o texto do design; o que está como placeholder
e precisa virar dado real:

- **WhatsApp** (seção *Geral*): número real no formato `5592XXXXXXXXX`.
- **Telefone e e-mail** (rodapé → *Contato*): hoje `+55 (92) 0000-0000` e
  `contato@nortendengenharia.com.br`.
- **CNPJ e CREA** (rodapé → *Legal*): hoje `XX.XXX.XXX/0001-XX · CREA XX`.
- **Fotos** (Hero, 4 serviços, "Em campo", 3 posts do blog): hoje são imagens
  do Unsplash — trocar por fotografia real da equipe em campo. A foto de "Em
  campo" é a mais importante.
- **Logos de clientes** (seção *Clientes*): 6 espaços; alternar de texto para
  imagem e enviar os logos reais.
- **Métricas**: confirmar os números (anos, equipamentos inspecionados, etc.).

## Como rodar localmente

```bash
npm install
cp .env.example .env      # defina ao menos ADMIN_PASSWORD
npm start                 # http://localhost:3000
```

- Site: `http://localhost:3000/`
- Admin: `http://localhost:3000/admin`

## Como funciona o conteúdo

Todo o conteúdo da página vive em **`data/content.json`**. Esse arquivo:

- é criado no primeiro boot a partir de `data/content.default.json` (a "semente");
- é editado pelo painel `/admin` em tempo real — ao salvar, o site já reflete a mudança;
- **não** é versionado no Git (cada ambiente tem o seu), então um deploy de código nunca apaga o conteúdo de produção.

A cada save é gravado um `data/content.backup.json` com a versão anterior.

### Painel `/admin`

- **Textos:** edite nos campos e clique em **Salvar alterações** (rodapé).
  Listas (serviços, FAQ, métricas, posts do blog, etc.) podem ter linhas
  adicionadas, removidas e reordenadas no JSON.
- **Imagens:** botão **Trocar imagem** → o upload é aplicado na hora. As imagens
  vão para `public/uploads/`.
- **Ênfase:** nos títulos do Hero e da seção "Em campo", envolva uma palavra em
  `*asteriscos*` para destacá-la em itálico (serifa), como no design.
- **WhatsApp:** configure número/mensagem em **Geral**. Qualquer link com o valor
  `{whatsapp}` aponta automaticamente para o WhatsApp configurado.

## Estrutura

```
server.js                 App Express, rotas, sessão, upload (multer)
ecosystem.config.js       Processo PM2
lib/
  content.js              Carregar/salvar JSON, parse do form, merge profundo
  render.js               Helpers de render (escape, ênfase, link do WhatsApp)
data/
  content.default.json    Semente (versionada)
  content.json            Conteúdo de produção (NÃO versionado)
views/
  index.ejs               Landing page
  admin.ejs               Painel de edição
  login.ejs               Tela de login
public/
  css/ js/ assets/        Estáticos + logos
  uploads/                Imagens enviadas (NÃO versionado)
```

## Segurança

- `/admin` exige login (senha via `ADMIN_PASSWORD_HASH` bcrypt, ou
  `ADMIN_PASSWORD` em texto puro como fallback).
- Sessão por cookie httpOnly, `secure` em produção (HTTPS).
- Página de admin marcada como `noindex`.
