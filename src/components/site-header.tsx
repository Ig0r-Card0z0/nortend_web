import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/container";
import { siteConfig } from "@/lib/site";

const nav = [
  { href: "/servicos", label: "Serviços" },
  { href: "/clientes", label: "Clientes/Laudos" },
  { href: "/blog", label: "Blog" },
  { href: "/sobre", label: "Sobre" },
  { href: "/contato", label: "Contato" },
];

export function SiteHeader() {
  const whatsappHref =
    siteConfig.contact.whatsapp && siteConfig.contact.whatsapp !== "55XXXXXXXXXXX"
      ? `https://api.whatsapp.com/send/?phone=${siteConfig.contact.whatsapp}&text=${encodeURIComponent(
          "Olá! Gostaria de solicitar um orçamento/visita técnica."
        )}`
      : "/contato";

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/80 backdrop-blur dark:bg-black/60">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/brand/logo.png"
            alt={`${siteConfig.name} - ${siteConfig.legalName}`}
            width={170}
            height={40}
            priority
            className="h-8 w-auto"
          />
          <span className="sr-only">{siteConfig.name}</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-zinc-700 hover:text-zinc-950 dark:text-zinc-200 dark:hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/cliente/login"
            className="hidden rounded-md px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-white/10 md:inline-block"
          >
            Área do Cliente
          </Link>
          <Link
            href={whatsappHref}
            className="rounded-md bg-[color:var(--color-primary)] px-3 py-2 text-sm font-medium text-white hover:opacity-95"
          >
            Solicitar orçamento
          </Link>
        </div>
      </Container>
    </header>
  );
}
