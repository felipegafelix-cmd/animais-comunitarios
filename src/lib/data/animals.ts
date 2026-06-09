/**
 * Camada de acesso a dados dos animais.
 * Tenta Supabase; se não configurado, retorna mock para desenvolvimento.
 */
import { mockAnimals } from "@/lib/data/mock-animals";
import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type { AnimalWithStatus } from "@/types";

/**
 * Busca todos os animais com status de alimentação para o dashboard.
 * Ordenação: emergências primeiro, depois por nome.
 */
export async function getAnimalsForDashboard(): Promise<AnimalWithStatus[]> {
  if (!isSupabaseConfigured) {
    return sortAnimals(mockAnimals);
  }

  const supabase = createSupabaseServerClient();
  if (!supabase) {
    return sortAnimals(mockAnimals);
  }

  const { data: animals, error } = await supabase
    .from("animals")
    .select("*")
    .order("is_emergency", { ascending: false })
    .order("name", { ascending: true });

  if (error || !animals) {
    console.error("[getAnimalsForDashboard]", error?.message);
    return sortAnimals(mockAnimals);
  }

  const animalsWithFeeding: AnimalWithStatus[] = await Promise.all(
    animals.map(async (animal) => {
      const { data: lastFeed } = await supabase
        .from("feeding_logs")
        .select("fed_at, fed_by_name")
        .eq("animal_id", animal.id)
        .order("fed_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      return {
        ...animal,
        last_fed_at: lastFeed?.fed_at ?? null,
        last_fed_by: lastFeed?.fed_by_name ?? null,
      };
    }),
  );

  return sortAnimals(animalsWithFeeding);
}

/** Garante ordem consistente: emergência → alfabético */
function sortAnimals(list: AnimalWithStatus[]): AnimalWithStatus[] {
  return [...list].sort((a, b) => {
    if (a.is_emergency !== b.is_emergency) {
      return a.is_emergency ? -1 : 1;
    }
    return a.name.localeCompare(b.name, "pt-BR");
  });
}

/** Conta quantos animais estão em estado de emergência */
export function countEmergencies(animals: AnimalWithStatus[]): number {
  return animals.filter((a) => a.is_emergency).length;
}

/** Conta animais que nunca foram alimentados (sem registro) */
export function countNeverFed(animals: AnimalWithStatus[]): number {
  return animals.filter((a) => !a.last_fed_at).length;
}
