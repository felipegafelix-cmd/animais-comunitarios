/**
 * Camada de acesso a dados dos animais.
 * Tenta Supabase; se não configurado, retorna mock para desenvolvimento.
 */
import { mockAnimals, mockFeedingLogs } from "@/lib/data/mock-animals";
import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type { AnimalWithStatus, FeedingLog } from "@/types";

/**
 * Busca todos os animais com status de alimentação para o dashboard.
 * Ordenação: emergências primeiro, depois por nome.
 */
export async function getAnimalsForDashboard(): Promise<AnimalWithStatus[]> {
  if (!isSupabaseConfigured) {
    return sortAnimals(mockAnimals);
  }

  const supabase = await createSupabaseServerClient();
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

/**
 * Busca um único animal pelo ID, incluindo último status de alimentação.
 * Retorna null se não encontrado.
 */
export async function getAnimalById(id: string): Promise<AnimalWithStatus | null> {
  if (!isSupabaseConfigured) {
    return mockAnimals.find((a) => a.id === id) ?? null;
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return mockAnimals.find((a) => a.id === id) ?? null;
  }

  const { data: animal, error } = await supabase
    .from("animals")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !animal) {
    console.error("[getAnimalById]", error?.message);
    return mockAnimals.find((a) => a.id === id) ?? null;
  }

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
}

/**
 * Busca o histórico de alimentação de um animal (mais recentes primeiro).
 * Limite de 20 registros para a view do perfil.
 */
export async function getAnimalFeedingHistory(animalId: string): Promise<FeedingLog[]> {
  if (!isSupabaseConfigured) {
    return mockFeedingLogs
      .filter((log) => log.animal_id === animalId)
      .sort((a, b) => new Date(b.fed_at).getTime() - new Date(a.fed_at).getTime());
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return mockFeedingLogs
      .filter((log) => log.animal_id === animalId)
      .sort((a, b) => new Date(b.fed_at).getTime() - new Date(a.fed_at).getTime());
  }

  const { data: logs, error } = await supabase
    .from("feeding_logs")
    .select("*")
    .eq("animal_id", animalId)
    .order("fed_at", { ascending: false })
    .limit(20);

  if (error || !logs) {
    console.error("[getAnimalFeedingHistory]", error?.message);
    return [];
  }

  return logs;
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
