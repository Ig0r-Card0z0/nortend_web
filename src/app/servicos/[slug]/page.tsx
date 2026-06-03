import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/container";
import { getServiceBySlug, services } from "@/lib/services";

type Props = {
  params: { slug: string };
};

export async function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params;
  const service = getServiceBySlug(slug);
  if (!service) return {};
  return { title: service.title, description: service.summary };
}

export default async function ServicoDetalhePage({ params }: Props) {
  const { slug } = params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  return (
    <Container className="py-12">
      <div className="mb-6 text-sm">
        <Link href="/servicos" className="text-zinc-600 hover:underline">
          ← Voltar para serviços
        </Link>
      </div>

      <header className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">{service.title}</h1>
        <p className="max-w-prose text-zinc-600 dark:text-zinc-300">
          {service.summary}
        </p>
      </header>

      <section className="mt-10 grid gap-8 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          <h2 className="text-xl font-semibold">Como entregamos</h2>
          <p className="text-zinc-600 dark:text-zinc-300">
            Esta página é um modelo. Vamos ajustar o texto para refletir exatamente
            o seu processo, normas aplicáveis e entregáveis (ex.: ART, prontuário,
            checklist, relatórios e recomendações).
          </p>

          <div className="rounded-2xl border border-black/5 bg-white p-6 dark:bg-white/5">
            <h3 className="font-semibold">Etapas típicas</h3>
            <ol className="mt-3 space-y-2 text-sm text-zinc-700 dark:text-zinc-200">
              <li>1) Levantamento e definição de escopo</li>
              <li>2) Inspeção em campo e coleta de evidências</li>
              <li>3) Análise técnica e enquadramento normativo</li>
              <li>4) Emissão de relatório e recomendações</li>
            </ol>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm dark:bg-white/5">
            <h3 className="font-semibold">Inclui</h3>
            <ul className="mt-3 space-y-2 text-sm text-zinc-700 dark:text-zinc-200">
              {service.bullets.map((b) => (
                <li key={b}>• {b}</li>
              ))}
            </ul>
          </div>

          <Link
            href="/contato"
            className="block rounded-2xl bg-[color:var(--color-primary)] px-6 py-4 text-center text-sm font-medium text-white hover:opacity-95"
          >
            Solicitar proposta deste serviço
          </Link>
        </aside>
      </section>
    </Container>
  );
}
