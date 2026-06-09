"use server";

/**
 * Server Action — ativa ou desativa o alerta de emergência de um animal.
 * Atualiza `is_emergency` e `emergency_note` na tabela `animals`.
 */
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";

interface ToggleEmergencyResult {
  success: boolean;
  error?: string;
}

export async function toggleEmergency(
  animalId: string,
  activate: boolean,
  note?: string,
): Promise<ToggleEmergencyResult> {
  if (!isSupabaseConfigured) {
    // Modo demo — simula sucesso
    revalidatePath(`/animais/${animalId}`);
    revalidatePath("/");
    return { success: true };
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { success: false, error: "Não foi possível conectar ao banco de dados." };
  }

  const { error } = await supabase
    .from("animals")
    .update({
      is_emergency: activate,
      emergency_note: activate ? (note || null) : null,
    })
    .eq("id", animalId);

  if (error) {
    console.error("[toggleEmergency]", error.message);
    return { success: false, error: "Falha ao atualizar emergência. Tente novamente." };
  }

  revalidatePath(`/animais/${animalId}`);
  revalidatePath("/");

  return { success: true };
}
