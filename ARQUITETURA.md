# Decisão de arquitetura — editar em produção vs. fazer push

> Resposta à pergunta: *"é melhor editar o conteúdo direto em produção ou fazer
> push de código quando precisar mudar texto/imagem?"*

## Recomendação: editar em produção (o que este projeto já faz)

Para uma landing page institucional, **editar o conteúdo direto em produção,
pelo painel `/admin`, sem rebuild e sem deploy** é a melhor escolha — e é assim
que este projeto foi montado.

O conteúdo (textos, imagens, números, FAQ, etc.) vive em `data/content.json` e
em `public/uploads/`, **separado do código**. Quem edita pelo `/admin` grava
nesses arquivos no servidor e a página reflete na hora. O código (layout, CSS,
lógica) continua no Git e só muda por `git push` + `pm2 reload`.

É o melhor dos dois mundos: **conteúdo é dado, layout é código.**

## Por que não "push a cada mudança de texto"

A alternativa seria deixar o conteúdo dentro do repositório (em JSON/MDX) e,
para trocar uma palavra ou uma foto, editar o arquivo, commitar, dar push e
rebuildar/deployar. Os problemas:

- **Lento e travado num dev.** Trocar um telefone ou uma foto vira uma tarefa de
  desenvolvedor com Git. Ninguém da empresa consegue mexer sozinho.
- **Deploy a cada vírgula.** Cada ajuste de copy é um ciclo de build/deploy —
  desproporcional para o risco baixo de mudar um texto.
- **Imagem em repositório é ruim.** Fotos pesadas no Git incham o histórico.

Esse modelo (conteúdo no Git, build-time) só compensa quando o conteúdo é
versionado junto com features, precisa de revisão em PR, ou é gerado por muitos
autores com fluxo editorial — o caso de um blog grande, não de uma landing.

## Comparação rápida

| Critério | Editar em produção (este projeto) | Push a cada mudança |
|---|---|---|
| Quem edita texto/imagem | Você, pelo `/admin`, sozinho | Só quem tem o repo + sabe Git |
| Tempo para publicar | Imediato (salvar) | Commit → push → build → deploy |
| Precisa rebuild/deploy | Não (conteúdo) | Sim, sempre |
| Histórico/versão do conteúdo | Backup automático + cron | Histórico Git completo |
| Risco operacional | Baixo (campo de texto) | Médio (deploy por mudança trivial) |
| Melhor para | Landing institucional | Blog/docs com fluxo editorial |

## O equilíbrio adotado

- **Conteúdo** → editado em produção, **fora do Git** (`.gitignore` cobre
  `data/content.json` e `public/uploads/`). Um `git pull` nunca apaga o que foi
  editado no ar.
- **Código** (views, CSS, server) → versionado, muda por push + `pm2 reload`.
- **Semente** → `data/content.default.json` fica no Git. É o conteúdo inicial de
  um deploy novo; produção parte dele no primeiro boot e segue independente.
- **Segurança do conteúdo** → cada save gera `data/content.backup.json` (versão
  anterior). Para histórico de verdade, o `DEPLOY.md` traz um cron de backup
  diário de `content.json` + `uploads/`.

## Quando reabrir essa decisão

Migrar conteúdo para o Git/build passa a fazer sentido se algum dia você quiser:
revisão em PR antes de publicar texto, vários editores com papéis distintos, ou
um blog técnico extenso versionado com o código. Aí vale um CMS headless ou MDX
no repositório. Para a landing atual, é over-engineering.
