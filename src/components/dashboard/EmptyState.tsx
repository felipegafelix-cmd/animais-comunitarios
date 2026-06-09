/**
 * Estado vazio — quando não há animais cadastrados ainda.
 */
import { PawPrint, Plus } from "lucide-react";
import Link from "next/link";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center px-6 py-16 text-center">
      <div
        className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400"
        aria-hidden="true"
      >
        <PawPrint className="h-8 w-8" />
      </div>
      <h2 className="mb-2 text-lg font-semibold text-slate-900">
        Nenhum animal cadastrado
      </h2>
      <p className="mb-6 max-w-xs text-sm text-slate-500">
        Comece registrando os cães e gatos que sua comunidade cuida no bairro.
      </p>
      <Link
        href="/animais/novo"
        className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
        Cadastrar animal
      </Link>
    </div>
  );
}
