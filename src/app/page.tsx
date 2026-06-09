/**
 * Dashboard Principal — Página inicial (Passo 3 do MVP)
 *
 * Server Component: busca dados no servidor (Supabase ou mock).
 * Layout mobile-first com listagem semântica de animais comunitários.
 */
import { AnimalCard } from "@/components/dashboard/AnimalCard";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { EmergencyAlertSection } from "@/components/dashboard/EmergencyAlertSection";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { FloatingActionButton } from "@/components/dashboard/FloatingActionButton";
import {
  countEmergencies,
  countNeverFed,
  getAnimalsForDashboard,
} from "@/lib/data/animals";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export default async function DashboardPage() {
  // Busca animais com última alimentação — fallback automático para mock
  const animals = await getAnimalsForDashboard();
  const emergencyAnimals = animals.filter((a) => a.is_emergency);
  const neverFedCount = countNeverFed(animals);

  return (
    <>
      {/* Cabeçalho sticky com totais */}
      <DashboardHeader
        totalAnimals={animals.length}
        emergencyCount={countEmergencies(animals)}
      />

      <main id="conteudo-principal" className="mx-auto max-w-lg pb-24">
        {/* Aviso quando Supabase não está conectado — útil em dev/demo */}
        {!isSupabaseConfigured && (
          <aside
            className="mx-4 mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900"
            role="note"
          >
            <strong>Modo demonstração:</strong> exibindo dados de exemplo.
            Configure <code className="rounded bg-amber-100 px-1">.env.local</code>{" "}
            com as credenciais do Supabase para dados reais.
          </aside>
        )}

        {/* Seção de emergências — destaque no topo do painel */}
        <EmergencyAlertSection emergencyAnimals={emergencyAnimals} />

        {/* Resumo rápido em cards — métricas visuais antes da lista */}
        {animals.length > 0 && (
          <section
            aria-labelledby="resumo-heading"
            className="mx-4 mt-4 grid grid-cols-2 gap-3"
          >
            <h2 id="resumo-heading" className="sr-only">
              Resumo do bairro
            </h2>

            <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
              <p className="text-xs text-slate-500">Sem registro de comida</p>
              <p className="text-2xl font-bold text-amber-600">{neverFedCount}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
              <p className="text-xs text-slate-500">Precisam de atenção</p>
              <p className="text-2xl font-bold text-red-600">
                {emergencyAnimals.length}
              </p>
            </div>
          </section>
        )}

        {/* Listagem principal de animais */}
        <section aria-labelledby="lista-animais-heading" className="px-4 pt-6">
          <div className="mb-4 flex items-center justify-between">
            <h2
              id="lista-animais-heading"
              className="text-sm font-semibold uppercase tracking-wide text-slate-500"
            >
              Animais do bairro
            </h2>
            <span className="text-xs text-slate-400">
              {animals.length} cadastrado{animals.length !== 1 ? "s" : ""}
            </span>
          </div>

          {animals.length === 0 ? (
            <EmptyState />
          ) : (
            /* Lista semântica — cada item é um AnimalCard (<article>) */
            <ul className="space-y-3" role="list">
              {animals.map((animal) => (
                <li key={animal.id}>
                  <AnimalCard animal={animal} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      {/* FAB — cadastro rápido no celular */}
      {animals.length > 0 && <FloatingActionButton />}
    </>
  );
}
