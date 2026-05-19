export type Service = {
  slug: string;
  title: string;
  summary: string;
  bullets: string[];
};

export const services: Service[] = [
  {
    slug: "inspecao-nr13",
    title: "Inspeção de segurança NR-13",
    summary:
      "Inspeções, recomendações e documentação para caldeiras, vasos de pressão, tubulações e tanques.",
    bullets: [
      "Planejamento e escopo conforme NR-13",
      "Inspeção visual e dimensional (quando aplicável)",
      "Recomendações e plano de ações",
      "Relatório técnico detalhado",
    ],
  },
  {
    slug: "prontuarios-nr13",
    title: "Reconstituição de prontuários NR-13",
    summary:
      "Organização e reconstituição documental para prontuários, históricos e registros do equipamento.",
    bullets: [
      "Levantamento de documentos existentes",
      "Estruturação do prontuário do equipamento",
      "Padronização e checklist de pendências",
      "Suporte para auditorias e fiscalizações",
    ],
  },
  {
    slug: "estanqueidade",
    title: "Teste de estanqueidade",
    summary:
      "Teste para verificação de vazamentos e integridade, com emissão de laudo e recomendações.",
    bullets: [
      "Procedimento e condições de teste",
      "Registro e rastreabilidade",
      "Laudo técnico",
      "Recomendações e correções",
    ],
  },
];

export function getServiceBySlug(slug: string) {
  return services.find((s) => s.slug === slug) ?? null;
}

