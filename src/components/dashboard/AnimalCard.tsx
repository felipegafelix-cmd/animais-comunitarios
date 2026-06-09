/**
 * Card de animal — unidade principal da listagem do dashboard.
 * Mobile-first: layout horizontal compacto, áreas de toque amplas.
 * Semântica: <article> para cada animal independente.
 */
import {
  AlertCircle,
  Clock,
  MapPin,
  UtensilsCrossed,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import {
  formatLastFed,
  getInitials,
  needsFeedingAttention,
  speciesLabels,
} from "@/lib/utils/feeding";
import type { AnimalWithStatus } from "@/types";

interface AnimalCardProps {
  animal: AnimalWithStatus;
}

export function AnimalCard({ animal }: AnimalCardProps) {
  const feedingAttention = needsFeedingAttention(animal.last_fed_at);
  const lastFedText = formatLastFed(animal.last_fed_at);

  return (
    <article
      className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition-shadow hover:shadow-md ${
        animal.is_emergency
          ? "border-red-300 ring-2 ring-red-100"
          : "border-slate-200"
      }`}
    >
      <Link
        href={`/animais/${animal.id}`}
        className="flex gap-3 p-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
        aria-label={`Ver perfil de ${animal.name}`}
      >
        {/* Avatar / foto — placeholder com iniciais se não houver imagem */}
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-100">
          {animal.photo_url ? (
            <Image
              src={animal.photo_url}
              alt={`Foto de ${animal.name}`}
              fill
              className="object-cover"
              sizes="64px"
            />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center bg-teal-100 text-lg font-bold text-teal-700"
              aria-hidden="true"
            >
              {getInitials(animal.name)}
            </div>
          )}

          {/* Indicador visual de emergência sobre a foto */}
          {animal.is_emergency && (
            <span
              className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white"
              title="Emergência"
              aria-hidden="true"
            >
              <AlertCircle className="h-3 w-3" />
            </span>
          )}
        </div>

        {/* Conteúdo textual — nome, badges e metadados */}
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-1.5">
            <h3 className="truncate text-base font-semibold text-slate-900">
              {animal.name}
            </h3>
            <Badge variant="info">{speciesLabels[animal.species]}</Badge>
            {animal.is_neutered && (
              <Badge variant="success">Castrado</Badge>
            )}
            {animal.is_emergency && (
              <Badge variant="danger">Emergência</Badge>
            )}
          </div>

          {/* Localização — referência para encontrar o animal na rua */}
          <p className="mb-2 flex items-start gap-1 text-xs text-slate-500">
            <MapPin
              className="mt-0.5 h-3.5 w-3.5 shrink-0"
              aria-hidden="true"
            />
            <span className="line-clamp-2">{animal.location_description}</span>
          </p>

          {/* Status de alimentação — evita excesso de ração */}
          <div
            className={`flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs ${
              feedingAttention
                ? "bg-amber-50 text-amber-900"
                : "bg-slate-50 text-slate-600"
            }`}
          >
            <UtensilsCrossed className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>
              Última refeição: <strong>{lastFedText}</strong>
              {animal.last_fed_by && (
                <span className="text-slate-500"> · por {animal.last_fed_by}</span>
              )}
            </span>
            {feedingAttention && (
              <Clock className="ml-auto h-3.5 w-3.5 text-amber-600" aria-hidden="true" />
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
