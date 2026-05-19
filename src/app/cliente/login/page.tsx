"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ClienteLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-black/5 bg-white p-6 shadow-sm dark:bg-white/5">
      <h1 className="text-xl font-semibold tracking-tight">Área do Cliente</h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
        Login provisório. Quando você me passar o padrão de autenticação do
        sistema de relatórios (JWT, cookies, SSO, etc.), eu conecto aqui.
      </p>

      <div className="mt-6 space-y-4">
        <label className="space-y-1 text-sm">
          <span className="text-zinc-700 dark:text-zinc-200">E-mail</span>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            className="h-11 w-full rounded-md border border-black/10 bg-white px-3 outline-none focus:border-[color:var(--color-primary)] dark:border-white/15 dark:bg-black"
            placeholder="cliente@empresa.com"
          />
        </label>
        <label className="space-y-1 text-sm">
          <span className="text-zinc-700 dark:text-zinc-200">Senha</span>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            className="h-11 w-full rounded-md border border-black/10 bg-white px-3 outline-none focus:border-[color:var(--color-primary)] dark:border-white/15 dark:bg-black"
            placeholder="••••••••"
          />
        </label>

        <button
          type="button"
          onClick={() => router.push("/cliente/dashboard")}
          className="inline-flex h-11 w-full items-center justify-center rounded-md bg-[color:var(--color-primary)] px-5 text-sm font-medium text-white hover:opacity-95"
        >
          Entrar (demo)
        </button>
      </div>
    </div>
  );
}

