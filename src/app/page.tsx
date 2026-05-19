import Link from "next/link";
import { Container } from "@/components/container";
import { siteConfig } from "@/lib/site";

export default function Home() {
  const whatsappHref =
    siteConfig.contact.whatsapp && siteConfig.contact.whatsapp !== "55XXXXXXXXXXX"
      ? `https://api.whatsapp.com/send/?phone=${siteConfig.contact.whatsapp}&text=${encodeURIComponent(
          "Olá! Gostaria de solicitar um orçamento/visita técnica."
        )}`
      : "/contato";

  return (
    <div>
      {/* HERO */}
      <section className="bg-gradient-to-b from-zinc-50 to-white dark:from-black dark:to-black">
        <Container className="py-16 sm:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="space-y-6">
              <p className="inline-flex rounded-full bg-black/5 px-3 py-1 text-xs text-zinc-700 dark:bg-white/10 dark:text-zinc-200">
                Referência em inspeção e conformidade NR-13
              </p>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Inspeção de segurança em{" "}
                <span className="text-[color:var(--color-primary)]">
                  caldeiras, vasos de pressão, tubulações e tanques
                </span>
              </h1>
              <p className="max-w-prose text-zinc-600 dark:text-zinc-300">
                Atuamos com foco em NR-13 para garantir segurança operacional,
                conformidade e documentação técnica completa (prontuários,
                relatórios e recomendações).
              </p>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href={whatsappHref}
                  className="inline-flex items-center justify-center rounded-md bg-[color:var(--color-primary)] px-5 py-3 text-sm font-medium text-white hover:opacity-95"
                >
                  Solicitar orçamento
                </Link>
                <Link
                  href="/servicos"
                  className="inline-flex items-center justify-center rounded-md border border-black/10 bg-white px-5 py-3 text-sm font-medium hover:bg-zinc-50 dark:border-white/15 dark:bg-black dark:hover:bg-white/5"
                >
                  Ver serviços
                </Link>
              </div>

              <dl className="grid grid-cols-3 gap-4 pt-2 text-sm">
                <div className="rounded-lg border border-black/5 bg-white p-4 dark:bg-white/5">
                  <dt className="text-zinc-500">Foco</dt>
                  <dd className="font-semibold">NR-13</dd>
                </div>
                <div className="rounded-lg border border-black/5 bg-white p-4 dark:bg-white/5">
                  <dt className="text-zinc-500">Entrega</dt>
                  <dd className="font-semibold">Relatórios</dd>
                </div>
                <div className="rounded-lg border border-black/5 bg-white p-4 dark:bg-white/5">
                  <dt className="text-zinc-500">Atuação</dt>
                  <dd className="font-semibold">{siteConfig.contact.serviceArea}</dd>
                </div>
              </dl>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  title: "Caldeiras",
                  desc: "Inspeções e recomendações para operação segura.",
                },
                {
                  title: "Vasos de Pressão",
                  desc: "Integridade, prontuário e periodicidade NR-13.",
                },
                {
                  title: "Tubulações",
                  desc: "Avaliação de integridade e documentação técnica.",
                },
                {
                  title: "Tanques",
                  desc: "Inspeção, laudos e suporte ao plano de manutenção.",
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className="rounded-xl border border-black/5 bg-white p-6 shadow-sm dark:bg-white/5"
                >
                  <div className="text-base font-semibold">{card.title}</div>
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
                    {card.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* DIFERENCIAIS */}
      <section className="py-14">
        <Container>
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="space-y-3">
              <h2 className="text-2xl font-semibold tracking-tight">
                O que nos diferencia
              </h2>
              <p className="text-zinc-600 dark:text-zinc-300">
                Processo claro, documentação organizada e atendimento rápido —
                pensando na rotina de operação industrial.
              </p>
            </div>
            <ul className="grid gap-4 lg:col-span-2 sm:grid-cols-2">
              {[
                "Conformidade com NR-13 e normas aplicáveis",
                "Corpo técnico qualificado",
                "Relatórios de inspeção detalhados",
                "Reconstituição de prontuários NR-13",
                "Pronto atendimento e orientação técnica",
                "Organização para auditorias e fiscalizações",
              ].map((item) => (
                <li
                  key={item}
                  className="rounded-xl border border-black/5 bg-white p-5 text-sm text-zinc-700 dark:bg-white/5 dark:text-zinc-200"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* CTA FINAL */}
      <section className="py-14">
        <Container>
          <div className="rounded-2xl bg-[color:var(--color-primary)] px-6 py-10 text-white sm:px-10">
            <div className="grid gap-6 lg:grid-cols-3 lg:items-center">
              <div className="space-y-2 lg:col-span-2">
                <h3 className="text-xl font-semibold">
                  Quer agendar uma visita técnica?
                </h3>
                <p className="text-white/85">
                  Fale com a nossa equipe e receba uma proposta com escopo,
                  prazos e documentação prevista.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
                <Link
                  href={whatsappHref}
                  className="inline-flex items-center justify-center rounded-md bg-white px-5 py-3 text-sm font-medium text-black hover:bg-white/95"
                >
                  Chamar no WhatsApp
                </Link>
                <Link
                  href="/contato"
                  className="inline-flex items-center justify-center rounded-md border border-white/25 px-5 py-3 text-sm font-medium hover:bg-white/10"
                >
                  Formulário de contato
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
