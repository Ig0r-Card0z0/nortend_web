import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/container";
import { services } from "@/lib/services";

export const metadata: Metadata = {
  title: "Serviços",
  description:
    "Serviços de inspeção NR-13, reconstituição de prontuários e suporte técnico.",
};

export default function ServicosPage() {
  return (
    <Container className="py-12">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">Serviços</h1>
        <p className="max-w-prose text-zinc-600 dark:text-zinc-300">
          Abaixo estão os principais serviços. Podemos adaptar o escopo conforme o
          tipo de equipamento, criticidade e periodicidade exigida.
        </p>
      </header>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {services.map((service) => (
          <article
            key={service.slug}
            className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm dark:bg-white/5"
          >
            <h2 className="text-lg font-semibold">{service.title}</h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
              {service.summary}
            </p>
            <ul className="mt-4 space-y-2 text-sm text-zinc-700 dark:text-zinc-200">
              {service.bullets.slice(0, 3).map((b) => (
                <li key={b}>• {b}</li>
              ))}
            </ul>
            <div className="mt-5">
              <Link
                href={`/servicos/${service.slug}`}
                className="text-sm font-medium text-[color:var(--color-primary)] hover:underline"
              >
                Saiba mais →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </Container>
  );
}

