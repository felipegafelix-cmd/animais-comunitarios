/**
 * Faixa de alerta global — aparece quando há animais em emergência.
 * Destaque visual vermelho para chamar atenção imediata no celular.
 */
import { AlertTriangle } from "lucide-react";
import type { AnimalWithStatus } from "@/types";

interface EmergencyAlertSectionProps {
  emergencyAnimals: AnimalWithStatus[];
}

export function EmergencyAlertSection({
  emergencyAnimals,
}: EmergencyAlertSectionProps) {
  if (emergencyAnimals.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="emergency-heading"
      className="mx-4 mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 shadow-sm"
    >
      <div className="mb-3 flex items-center gap-2">
        <AlertTriangle
          className="h-5 w-5 shrink-0 text-red-600"
          aria-hidden="true"
        />
        <h2 id="emergency-heading" className="text-sm font-bold text-red-900">
          Emergências ativas ({emergencyAnimals.length})
        </h2>
      </div>

      <ul className="space-y-2" role="list">
        {emergencyAnimals.map((animal) => (
          <li
            key={animal.id}
            className="rounded-xl bg-white/80 px-3 py-2 text-sm text-red-900"
          >
            <strong>{animal.name}</strong>
            {animal.emergency_note && (
              <span className="mt-0.5 block text-red-700">
                {animal.emergency_note}
              </span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
