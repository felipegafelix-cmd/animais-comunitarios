"use server";

/**
 * Server Action — registra uma alimentação ("Alimentei agora").
 * Insere na tabela `feeding_logs` e revalida a página do animal.
 */
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";

interface RecordFeedingResult {
  success: boolean;
  error?: string;
}

export async function recordFeeding(
  animalId: string,
  fedByName?: string,
): Promise<RecordFeedingResult> {
  if (!isSupabaseConfigured) {
    // Modo demo — simula sucesso (dados mock não persistem)
    revalidatePath(`/animais/${animalId}`);
    revalidatePath("/");
    return { success: true };
  }

  const supabase = createSupabaseServerClient();
  if (!supabase) {
    return { success: false, error: "Não foi possível conectar ao banco de dados." };
  }

  const { error } = await supabase.from("feeding_logs").insert({
    animal_id: animalId,
    fed_by_name: fedByName || null,
  });

  if (error) {
    console.error("[recordFeeding]", error.message);
    return { success: false, error: "Falha ao registrar alimentação. Tente novamente." };
  }

  // Revalida as páginas que exibem dados de alimentação
  revalidatePath(`/animais/${animalId}`);
  revalidatePath("/");

  return { success: true };
}
