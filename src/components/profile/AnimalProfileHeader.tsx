/**
 * Cabeçalho do perfil do animal — foto/avatar grande, nome, badges e localização.
 * Semântica: <header> com <hgroup> para título + subtítulo.
 */
import { AlertCircle, MapPin, Scissors } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { getInitials, speciesLabels } from "@/lib/utils/feeding";
import type { AnimalWithStatus } from "@/types";

interface AnimalProfileHeaderProps {
  animal: AnimalWithStatus;
}

export function AnimalProfileHeader({ animal }: AnimalProfileHeaderProps) {
  return (
    <header className="relative overflow-hidden rounded-3xl bg-white shadow-sm border border-slate-200">
      {/* Faixa superior com gradiente baseado na espécie */}
      <div
        className={`h-24 ${
          animal.species === "dog"
            ? "bg-gradient-to-br from-teal-500 to-emerald-600"
            : "bg-gradient-to-br from-violet-500 to-purple-600"
        }`}
        aria-hidden="true"
      />

      {/* Avatar sobrepõe a faixa */}
      <div className="relative -mt-12 px-5 pb-5">
        <div className="mb-3 inline-block overflow-hidden rounded-2xl border-4 border-white shadow-md">
          {animal.photo_url ? (
            <Image
              src={animal.photo_url}
              alt={`Foto de ${animal.name}`}
              width={96}
              height={96}
              className="h-24 w-24 object-cover"
            />
          ) : (
            <div
              className={`flex h-24 w-24 items-center justify-center text-2xl font-bold ${
                animal.species === "dog"
                  ? "bg-teal-100 text-teal-700"
                  : "bg-violet-100 text-violet-700"
              }`}
              aria-hidden="true"
            >
              {getInitials(animal.name)}
            </div>
          )}
        </div>

        {/* Nome e badges */}
        <div className="mb-3">
          <h1 className="text-2xl font-bold text-slate-900">{animal.name}</h1>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <Badge variant="info">{speciesLabels[animal.species]}</Badge>
            {animal.is_neutered && (
              <Badge variant="success">
                <Scissors className="mr-1 inline h-3 w-3" aria-hidden="true" />
                Castrado
              </Badge>
            )}
            {animal.is_emergency && (
              <Badge variant="danger">
                <AlertCircle className="mr-1 inline h-3 w-3" aria-hidden="true" />
                Emergência
              </Badge>
            )}
          </div>
        </div>

        {/* Localização */}
        <p className="flex items-start gap-1.5 text-sm text-slate-600">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
          {animal.location_description}
        </p>

        {/* Nota de emergência, se houver */}
        {animal.is_emergency && animal.emergency_note && (
          <aside className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            <strong className="block text-xs font-semibold uppercase tracking-wider text-red-900">
              Nota de emergência
            </strong>
            {animal.emergency_note}
          </aside>
        )}
      </div>
    </header>
  );
}
