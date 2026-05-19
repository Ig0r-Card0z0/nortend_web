import type { Metadata } from "next";
import { Container } from "@/components/container";
import { ContactForm } from "@/components/contact-form";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contato",
  description: "Entre em contato para solicitar orçamento ou agendar visita técnica.",
};

export default function ContatoPage() {
  return (
    <Container className="py-12">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">Contato</h1>
        <p className="max-w-prose text-zinc-600 dark:text-zinc-300">
          Solicite orçamento, agende visita técnica ou tire dúvidas sobre NR-13.
        </p>
      </header>

      <div className="mt-10 grid gap-8 lg:grid-cols-3">
        <section className="rounded-2xl border border-black/5 bg-white p-6 dark:bg-white/5 lg:col-span-2">
          <h2 className="text-lg font-semibold">Envie uma mensagem</h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
            Você pode enviar via WhatsApp (recomendado) ou e-mail.
          </p>
          <div className="mt-6">
            <ContactForm />
          </div>
        </section>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-black/5 bg-white p-6 dark:bg-white/5">
            <div className="text-sm font-semibold">E-mail</div>
            <div className="mt-2 text-sm text-zinc-700 dark:text-zinc-200">
              {siteConfig.contact.email}
            </div>
          </div>
          <div className="rounded-2xl border border-black/5 bg-white p-6 dark:bg-white/5">
            <div className="text-sm font-semibold">Telefone/WhatsApp</div>
            <div className="mt-2 text-sm text-zinc-700 dark:text-zinc-200">
              {siteConfig.contact.phone}
            </div>
          </div>
          <div className="rounded-2xl border border-black/5 bg-white p-6 dark:bg-white/5">
            <div className="text-sm font-semibold">Local</div>
            <div className="mt-2 text-sm text-zinc-700 dark:text-zinc-200">
              {siteConfig.contact.city}
            </div>
          </div>
        </aside>
      </div>
    </Container>
  );
}

