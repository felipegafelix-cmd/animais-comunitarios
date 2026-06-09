/**
 * Botão flutuante (FAB) — ação primária no mobile para cadastrar animal.
 * Posição fixa inferior direita, padrão Material/mobile apps.
 */
import { Plus } from "lucide-react";
import Link from "next/link";

export function FloatingActionButton() {
  return (
    <Link
      href="/animais/novo"
      className="fixed bottom-6 right-4 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-teal-600 text-white shadow-lg shadow-teal-600/30 transition hover:bg-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 active:scale-95"
      aria-label="Cadastrar novo animal"
    >
      <Plus className="h-6 w-6" aria-hidden="true" />
    </Link>
  );
}
