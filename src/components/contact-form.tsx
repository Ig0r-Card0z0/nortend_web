"use client";

import { useMemo, useState } from "react";
import { siteConfig } from "@/lib/site";

export function ContactForm() {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");

  const whatsappHref = useMemo(() => {
    const phone = siteConfig.contact.whatsapp;
    const text = `Olá! Meu nome é ${name || "[seu nome]"}${
      company ? ` (${company})` : ""
    }. ${message || "Gostaria de solicitar um orçamento/visita técnica."}`;

    if (!phone || phone === "55XXXXXXXXXXX") return null;
    return `https://api.whatsapp.com/send/?phone=${phone}&text=${encodeURIComponent(
      text
    )}`;
  }, [company, message, name]);

  return (
    <form className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1 text-sm">
          <span className="text-zinc-700 dark:text-zinc-200">Nome</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-11 w-full rounded-md border border-black/10 bg-white px-3 outline-none focus:border-[color:var(--color-primary)] dark:border-white/15 dark:bg-black"
            placeholder="Seu nome"
          />
        </label>
        <label className="space-y-1 text-sm">
          <span className="text-zinc-700 dark:text-zinc-200">Empresa</span>
          <input
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="h-11 w-full rounded-md border border-black/10 bg-white px-3 outline-none focus:border-[color:var(--color-primary)] dark:border-white/15 dark:bg-black"
            placeholder="Nome da empresa"
          />
        </label>
      </div>

      <label className="space-y-1 text-sm">
        <span className="text-zinc-700 dark:text-zinc-200">Mensagem</span>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="min-h-32 w-full resize-y rounded-md border border-black/10 bg-white px-3 py-2 outline-none focus:border-[color:var(--color-primary)] dark:border-white/15 dark:bg-black"
          placeholder="Descreva o equipamento, localização e o que você precisa (inspeção NR-13, prontuário, relatório, etc.)"
        />
      </label>

      <div className="flex flex-col gap-3 sm:flex-row">
        {whatsappHref ? (
          <a
            href={whatsappHref}
            className="inline-flex h-11 items-center justify-center rounded-md bg-[color:var(--color-primary)] px-5 text-sm font-medium text-white hover:opacity-95"
          >
            Enviar pelo WhatsApp
          </a>
        ) : (
          <div className="rounded-md border border-[color:var(--color-accent)]/40 bg-[color:var(--color-accent)]/10 px-4 py-3 text-sm text-zinc-800 dark:text-zinc-200">
            Configure o WhatsApp em <code>src/lib/site.ts</code> para ativar o
            envio direto.
          </div>
        )}
        <a
          href={`mailto:${siteConfig.contact.email}?subject=${encodeURIComponent(
            "Solicitação de orçamento (NR-13)"
          )}&body=${encodeURIComponent(
            `Nome: ${name}\nEmpresa: ${company}\n\n${message}`
          )}`}
          className="inline-flex h-11 items-center justify-center rounded-md border border-black/10 bg-white px-5 text-sm font-medium hover:bg-zinc-50 dark:border-white/15 dark:bg-black dark:hover:bg-white/5"
        >
          Enviar por e-mail
        </a>
      </div>
    </form>
  );
}

