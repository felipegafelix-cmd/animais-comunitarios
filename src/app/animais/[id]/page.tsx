/**
 * Perfil do Animal — página individual com dados, alimentação e emergência.
 *
 * Server Component: busca dados no servidor (Supabase ou mock).
 * Compõe Client Components para interações (botão alimentar, toggle emergência).
 */
import { ArrowLeft, Clock, UtensilsCrossed } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AnimalProfileHeader } from "@/components/profile/AnimalProfileHeader";
import { EmergencyToggle } from "@/components/profile/EmergencyToggle";
import { FeedingButton } from "@/components/profile/FeedingButton";
import { FeedingHistory } from "@/components/profile/FeedingHistory";
import { getAnimalById, getAnimalFeedingHistory } from "@/lib/data/animals";
import { formatLastFed, needsFeedingAttention } from "@/lib/utils/feeding";

interface PageProps {
  params: Promise<{ id: string }>;
}

/** Gera metadata dinâmica para SEO — título com nome do animal */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const animal = await getAnimalById(id);

  if (!animal) {
    return { title: "Animal não encontrado | Animais do Bairro" };
  }

  return {
    title: `${animal.name} | Animais do Bairro`,
    description: `Perfil de ${animal.name} — ${animal.location_description}`,
  };
}

export default async function AnimalProfilePage({ params }: PageProps) {
  const { id } = await params;

  // Busca animal e histórico em paralelo
  const [animal, feedingLogs] = await Promise.all([
    getAnimalById(id),
    getAnimalFeedingHistory(id),
  ]);

  if (!animal) {
    notFound();
  }

  const feedingAttention = needsFeedingAttention(animal.last_fed_at);
  const lastFedText = formatLastFed(animal.last_fed_at);

  return (
    <>
      {/* Barra de navegação superior */}
      <nav className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-3">
          <Link
            href="/"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
            aria-label="Voltar ao painel"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="truncate text-base font-semibold text-slate-900">
            {animal.name}
          </h1>
        </div>
      </nav>

      <main id="perfil-animal" className="mx-auto max-w-lg space-y-4 px-4 pb-8 pt-4">
        {/* Header com foto, nome, badges e localização */}
        <AnimalProfileHeader animal={animal} />

        {/* Card de status de alimentação */}
        <section
          aria-labelledby="status-alimentacao"
          className={`rounded-3xl border p-5 shadow-sm ${
            feedingAttention
              ? "border-amber-200 bg-amber-50"
              : "border-slate-200 bg-white"
          }`}
        >
          <div className="mb-3 flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                feedingAttention
                  ? "bg-amber-200 text-amber-800"
                  : "bg-teal-100 text-teal-700"
              }`}
              aria-hidden="true"
            >
              <UtensilsCrossed className="h-4 w-4" />
            </div>
            <h2 id="status-alimentacao" className="text-base font-semibold text-slate-900">
              Alimentação
            </h2>
          </div>

          <div className="mb-4 flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-slate-400" aria-hidden="true" />
            <span className="text-slate-600">
              Última refeição:{" "}
              <strong className={feedingAttention ? "text-amber-800" : "text-slate-900"}>
                {lastFedText}
              </strong>
            </span>
            {animal.last_fed_by && (
              <span className="text-slate-400">· por {animal.last_fed_by}</span>
            )}
          </div>

          {/* Botão principal de ação */}
          <FeedingButton animalId={animal.id} animalName={animal.name} />
        </section>

        {/* Histórico de alimentação */}
        <FeedingHistory logs={feedingLogs} />

        {/* Toggle de emergência */}
        <EmergencyToggle
          animalId={animal.id}
          animalName={animal.name}
          isEmergency={animal.is_emergency}
          emergencyNote={animal.emergency_note}
        />
      </main>
    </>
  );
}
