/**
 * Cabeçalho fixo do dashboard — identidade visual e resumo rápido.
 * Usa <header> semântico; sticky para acesso rápido ao scroll no celular.
 */
import { Heart, PawPrint } from "lucide-react";
import { LogoutButton } from "@/components/dashboard/LogoutButton";

interface DashboardHeaderProps {
  totalAnimals: number;
  emergencyCount: number;
}

export function DashboardHeader({
  totalAnimals,
  emergencyCount,
}: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-4">
        {/* Logo + título — área de marca reconhecível na rua */}
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white shadow-sm"
            aria-hidden="true"
          >
            <PawPrint className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight text-slate-900">
              Animais do Bairro
            </h1>
            <p className="text-xs text-slate-500">Gestão comunitária</p>
          </div>
        </div>

        {/* Resumo numérico e Logout */}
        <div className="flex flex-col items-end gap-1.5">
          <div className="flex items-center gap-2 text-right">
            <div>
              <p className="text-xs text-slate-500">Total</p>
              <p className="text-sm font-semibold text-slate-900">
                {totalAnimals}
              </p>
            </div>
            {emergencyCount > 0 && (
              <div
                className="flex items-center gap-1 rounded-lg bg-red-50 px-2 py-1 text-red-700"
                role="status"
                aria-label={`${emergencyCount} emergência${emergencyCount > 1 ? "s" : ""}`}
              >
                <Heart className="h-3.5 w-3.5 fill-red-500 text-red-500" />
                <span className="text-sm font-bold">{emergencyCount}</span>
              </div>
            )}
          </div>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
