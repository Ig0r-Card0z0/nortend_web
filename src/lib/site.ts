export const siteConfig = {
  name: "NORTEND",
  legalName: "Nortend Engenharia e Inspeção",
  description:
    "Engenharia e inspeção com foco em NR-13 (caldeiras, vasos de pressão, tubulações e tanques).",
  url: "https://exemplo.com",
  locale: "pt-BR",
  contact: {
    whatsapp: "55XXXXXXXXXXX",
    phone: "55XXXXXXXXXXX",
    email: "contato@exemplo.com",
    city: "Sua cidade/UF",
    serviceArea: "Atendimento nacional",
  },
  social: {
    instagram: "",
    linkedin: "",
  },
} as const;

export type SiteConfig = typeof siteConfig;
