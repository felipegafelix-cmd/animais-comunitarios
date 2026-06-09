/**
 * Placeholder — perfil do animal (próxima sprint).
 * Mantém links do dashboard funcionais sem 404.
 */
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AnimalProfilePage({ params }: PageProps) {
  const { id } = await params;

  return (
    <main className="mx-auto max-w-lg px-4 py-8">
      <Link
        href="/"
        className="mb-6 inline-block text-sm text-teal-600 hover:underline"
      >
        ← Voltar ao painel
      </Link>
      <h1 className="text-xl font-bold text-slate-900">Perfil do animal</h1>
      <p className="mt-2 text-sm text-slate-500">
        ID: {id} — em desenvolvimento na próxima sprint (alimentação, saúde,
        emergência).
      </p>
    </main>
  );
}
