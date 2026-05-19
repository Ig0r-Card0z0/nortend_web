import Link from "next/link";

export default function ClienteDashboardPage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            Modelo de área do cliente para integrar com o sistema de relatórios.
          </p>
        </div>
        <Link
          href="/"
          className="text-sm font-medium text-[color:var(--color-primary)] hover:underline"
        >
          Voltar ao site
        </Link>
      </header>

      <section className="rounded-2xl border border-black/5 bg-white p-6 dark:bg-white/5">
        <h2 className="text-base font-semibold">Relatórios recentes</h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
          Aqui você vai listar relatórios gerados pelo seu projeto (por cliente,
          equipamento, data, status e download).
        </p>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="text-xs uppercase text-zinc-500">
              <tr>
                <th className="py-2 pr-4">Equipamento</th>
                <th className="py-2 pr-4">Data</th>
                <th className="py-2 pr-4">Tipo</th>
                <th className="py-2">Ações</th>
              </tr>
            </thead>
            <tbody className="align-top">
              {[
                {
                  equipamento: "Vaso de Pressão VP-01",
                  data: "2026-05-10",
                  tipo: "Inspeção NR-13",
                },
                {
                  equipamento: "Caldeira C-02",
                  data: "2026-04-22",
                  tipo: "Prontuário",
                },
              ].map((row) => (
                <tr key={row.equipamento} className="border-t border-black/5">
                  <td className="py-3 pr-4 font-medium">{row.equipamento}</td>
                  <td className="py-3 pr-4 text-zinc-600 dark:text-zinc-300">
                    {new Date(row.data).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="py-3 pr-4 text-zinc-600 dark:text-zinc-300">
                    {row.tipo}
                  </td>
                  <td className="py-3">
                    <button
                      type="button"
                      className="rounded-md border border-black/10 bg-white px-3 py-2 text-xs font-medium hover:bg-zinc-50 dark:border-white/15 dark:bg-black dark:hover:bg-white/5"
                      disabled
                      title="Integração pendente"
                    >
                      Download (demo)
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

