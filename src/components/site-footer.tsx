import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/container";
import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-black/5">
      <Container className="grid gap-10 py-12 md:grid-cols-4">
        <div className="space-y-2 md:col-span-2">
          <div className="flex items-center gap-3">
            <Image
              src="/brand/logo.png"
              alt={`${siteConfig.name} - ${siteConfig.legalName}`}
              width={170}
              height={40}
              className="h-8 w-auto"
            />
          </div>
          <p className="max-w-prose text-sm text-zinc-600 dark:text-zinc-300">
            {siteConfig.description}
          </p>
        </div>

        <div className="space-y-3 text-sm">
          <div className="font-semibold">Links</div>
          <ul className="space-y-2 text-zinc-700 dark:text-zinc-200">
            <li>
              <Link href="/servicos">Serviços</Link>
            </li>
            <li>
              <Link href="/blog">Blog</Link>
            </li>
            <li>
              <Link href="/sobre">Sobre</Link>
            </li>
            <li>
              <Link href="/contato">Contato</Link>
            </li>
          </ul>
        </div>

        <div className="space-y-3 text-sm">
          <div className="font-semibold">Contato</div>
          <ul className="space-y-2 text-zinc-700 dark:text-zinc-200">
            <li>{siteConfig.contact.city}</li>
            <li>{siteConfig.contact.serviceArea}</li>
            <li>
              <a href={`mailto:${siteConfig.contact.email}`}>
                {siteConfig.contact.email}
              </a>
            </li>
            <li>{siteConfig.contact.phone}</li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-black/5 py-6 text-center text-xs text-zinc-500">
        <Container>
          © {new Date().getFullYear()} {siteConfig.legalName}. Todos os direitos
          reservados.
        </Container>
      </div>
    </footer>
  );
}
