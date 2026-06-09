/**
 * Placeholder — formulário de cadastro (próxima sprint).
 */
import Link from "next/link";

export default function NewAnimalPage() {
  return (
    <main className="mx-auto max-w-lg px-4 py-8">
      <Link
        href="/"
        className="mb-6 inline-block text-sm text-teal-600 hover:underline"
      >
        ← Voltar ao painel
      </Link>
      <h1 className="text-xl font-bold text-slate-900">Cadastrar animal</h1>
      <p className="mt-2 text-sm text-slate-500">
        Formulário de cadastro em desenvolvimento na próxima sprint.
      </p>
    </main>
  );
}
