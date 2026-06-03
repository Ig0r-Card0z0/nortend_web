import type { Metadata } from "next";
import { Container } from "@/components/container";

export const metadata: Metadata = {
  title: "Área do Cliente",
  robots: { index: false, follow: false },
};

export default function ClienteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-zinc-50 py-10 dark:bg-black">
      <Container>{children}</Container>
    </div>
  );
}

