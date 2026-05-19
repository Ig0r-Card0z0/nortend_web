import type { Metadata } from "next";
import { Container } from "@/components/container";

export const metadata: Metadata = {
  title: "Sobre",
  description: "Conheça nossa experiência em inspeção NR-13 e engenharia mecânica.",
};

export default function SobrePage() {
  return (
    <Container className="py-12">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">Quem somos</h1>
        <p className="max-w-prose text-zinc-600 dark:text-zinc-300">
          Esta página está com conteúdo provisório. Assim que você me enviar nome,
          história e diferenciais (ou mesmo apenas tópicos), eu reescrevo com um
          texto completo e profissional.
        </p>
      </header>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        <section className="rounded-2xl border border-black/5 bg-white p-6 dark:bg-white/5 lg:col-span-2">
          <h2 className="text-lg font-semibold">Experiência e qualidade</h2>
          <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-300">
            Atuamos com inspeção de segurança e suporte técnico com foco em NR-13,
            orientando nossos clientes para conformidade, organização documental e
            operação segura.
          </p>
          <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-300">
            Nosso objetivo é entregar relatórios claros e rastreáveis, com
            recomendações práticas para o dia a dia da planta industrial.
          </p>
        </section>

        <aside className="rounded-2xl border border-black/5 bg-white p-6 dark:bg-white/5">
          <h3 className="font-semibold">Diferenciais</h3>
          <ul className="mt-3 space-y-2 text-sm text-zinc-700 dark:text-zinc-200">
            <li>• Atendimento ágil e orientativo</li>
            <li>• Documentação organizada</li>
            <li>• Clareza nos relatórios e recomendações</li>
            <li>• Suporte para auditorias</li>
          </ul>
        </aside>
      </div>
    </Container>
  );
}

