"use client";

/**
 * Botão "Alimentei Agora" — Client Component com feedback visual.
 * Usa useTransition para loading state não-bloqueante.
 * Animação de confirmação com check após sucesso.
 */
import { Check, Loader2, UtensilsCrossed } from "lucide-react";
import { useTransition, useState, useCallback } from "react";
import { recordFeeding } from "@/app/actions/feeding";

interface FeedingButtonProps {
  animalId: string;
  animalName: string;
}

export function FeedingButton({ animalId, animalName }: FeedingButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleFeed = useCallback(() => {
    setStatus("idle");
    setErrorMessage("");

    startTransition(async () => {
      const result = await recordFeeding(animalId);

      if (result.success) {
        setStatus("success");
        // Volta ao estado normal após 3 segundos
        setTimeout(() => setStatus("idle"), 3000);
      } else {
        setStatus("error");
        setErrorMessage(result.error ?? "Erro desconhecido");
      }
    });
  }, [animalId]);

  return (
    <div>
      <button
        type="button"
        onClick={handleFeed}
        disabled={isPending || status === "success"}
        aria-label={`Registrar alimentação de ${animalName}`}
        className={`flex w-full items-center justify-center gap-2.5 rounded-2xl px-6 py-4 text-base font-semibold shadow-sm transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed ${
          status === "success"
            ? "bg-emerald-600 text-white focus-visible:ring-emerald-500 shadow-emerald-600/20"
            : status === "error"
              ? "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500"
              : "bg-teal-600 text-white hover:bg-teal-700 focus-visible:ring-teal-500 shadow-teal-600/20"
        }`}
      >
        {isPending ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
            Registrando…
          </>
        ) : status === "success" ? (
          <>
            <Check className="h-5 w-5" aria-hidden="true" />
            Alimentação registrada!
          </>
        ) : (
          <>
            <UtensilsCrossed className="h-5 w-5" aria-hidden="true" />
            Alimentei agora
          </>
        )}
      </button>

      {/* Mensagem de erro */}
      {status === "error" && (
        <p className="mt-2 text-center text-sm text-red-600" role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
