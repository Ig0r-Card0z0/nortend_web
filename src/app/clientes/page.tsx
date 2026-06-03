import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/container";

export const metadata: Metadata = {
  title: "Clientes e Laudos",
  description:
    "Clientes atendidos e acesso à área do cliente para relatórios e laudos.",
};

export default function ClientesPage() {
  return (
    <Container className="py-12">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">Clientes/Laudos</h1>
        <p className="max-w-prose text-zinc-600 dark:text-zinc-300">
          Esta página reúne informações públicas (ex.: segmentos atendidos) e
          direciona para a área do cliente, onde você vai integrar o projeto de
          geração/consulta de relatórios.
        </p>
      </header>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        <section className="rounded-2xl border border-black/5 bg-white p-6 dark:bg-white/5 lg:col-span-2">
          <h2 className="text-lg font-semibold">Segmentos atendidos</h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
            (Placeholder) Aqui podemos listar os segmentos/indústrias e inserir
            logos de clientes (se você tiver autorização para uso).
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              "Alimentos e bebidas",
              "Química e petroquímica",
              "Papel e celulose",
              "Energia",
              "Metalurgia",
              "Logística/armazenagem",
            ].map((item) => (
              <div
                key={item}
                className="rounded-xl border border-black/5 bg-white p-4 text-sm text-zinc-700 dark:bg-black/20 dark:text-zinc-200"
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm dark:bg-white/5">
            <h3 className="font-semibold">Área do Cliente</h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
              Acesse relatórios/laudos, históricos e arquivos do seu equipamento.
            </p>
            <Link
              href="/cliente/login"
              className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-md bg-[color:var(--color-primary)] px-5 text-sm font-medium text-white hover:opacity-95"
            >
              Entrar
            </Link>
          </div>

          <div className="rounded-2xl border border-black/5 bg-white p-6 dark:bg-white/5">
            <h3 className="font-semibold">Integração</h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
              Quando você me passar detalhes do projeto de relatórios (API, rotas,
              auth), eu conecto esta área com o sistema.
            </p>
          </div>
        </aside>
      </div>
    </Container>
  );
}

