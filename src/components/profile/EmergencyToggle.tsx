"use client";

/**
 * Toggle de emergência — botão para ativar/desativar alerta no perfil.
 * Pede confirmação visual antes de executar a ação.
 */
import { AlertTriangle, Check, Loader2, ShieldOff } from "lucide-react";
import { useTransition, useState, useCallback } from "react";
import { toggleEmergency } from "@/app/actions/emergency";

interface EmergencyToggleProps {
  animalId: string;
  animalName: string;
  isEmergency: boolean;
  emergencyNote: string | null;
}

export function EmergencyToggle({
  animalId,
  animalName,
  isEmergency,
  emergencyNote,
}: EmergencyToggleProps) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "confirming" | "success" | "error">("idle");
  const [note, setNote] = useState(emergencyNote ?? "");
  const [errorMessage, setErrorMessage] = useState("");

  const handleClick = useCallback(() => {
    if (status === "idle") {
      // Primeiro clique: pede confirmação
      setStatus("confirming");
      return;
    }

    if (status === "confirming") {
      // Segundo clique: executa a ação
      setErrorMessage("");

      startTransition(async () => {
        const result = await toggleEmergency(
          animalId,
          !isEmergency,
          !isEmergency ? note : undefined,
        );

        if (result.success) {
          setStatus("success");
          setTimeout(() => setStatus("idle"), 2000);
        } else {
          setStatus("error");
          setErrorMessage(result.error ?? "Erro desconhecido");
        }
      });
    }
  }, [status, animalId, isEmergency, note]);

  const handleCancel = useCallback(() => {
    setStatus("idle");
    setNote(emergencyNote ?? "");
  }, [emergencyNote]);

  // Se está em modo de confirmação para ATIVAR emergência, mostra campo de nota
  const showNoteInput = status === "confirming" && !isEmergency;

  return (
    <div className="rounded-3xl bg-white border border-slate-200 shadow-sm p-5">
      <div className="mb-3 flex items-center gap-2">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-lg ${
            isEmergency ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-500"
          }`}
          aria-hidden="true"
        >
          <AlertTriangle className="h-4 w-4" />
        </div>
        <h2 className="text-base font-semibold text-slate-900">
          Alerta de emergência
        </h2>
      </div>

      <p className="mb-4 text-sm text-slate-500">
        {isEmergency
          ? "Este animal está marcado como emergência. A comunidade foi alertada."
          : "Ative o alerta se este animal precisa de ajuda urgente (ferimento, doença, etc.)."}
      </p>

      {/* Campo de nota para emergência — visível na confirmação */}
      {showNoteInput && (
        <div className="mb-4">
          <label htmlFor="emergency-note" className="mb-1 block text-sm font-medium text-slate-700">
            O que aconteceu? <span className="text-slate-400">(opcional)</span>
          </label>
          <input
            id="emergency-note"
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Ex: pata ferida, não está comendo..."
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
          />
        </div>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleClick}
          disabled={isPending}
          aria-label={
            isEmergency
              ? `Desativar emergência de ${animalName}`
              : `Ativar emergência para ${animalName}`
          }
          className={`flex flex-1 items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed ${
            status === "success"
              ? "bg-emerald-600 text-white"
              : isEmergency
                ? "bg-slate-200 text-slate-700 hover:bg-slate-300 focus-visible:ring-slate-400"
                : status === "confirming"
                  ? "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500"
                  : "border-2 border-red-200 bg-red-50 text-red-700 hover:bg-red-100 focus-visible:ring-red-500"
          }`}
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Atualizando…
            </>
          ) : status === "success" ? (
            <>
              <Check className="h-4 w-4" aria-hidden="true" />
              Atualizado!
            </>
          ) : isEmergency ? (
            <>
              <ShieldOff className="h-4 w-4" aria-hidden="true" />
              Desativar emergência
            </>
          ) : status === "confirming" ? (
            <>
              <AlertTriangle className="h-4 w-4" aria-hidden="true" />
              Confirmar alerta
            </>
          ) : (
            <>
              <AlertTriangle className="h-4 w-4" aria-hidden="true" />
              Ativar emergência
            </>
          )}
        </button>

        {/* Botão cancelar — aparece apenas na confirmação */}
        {status === "confirming" && (
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-2xl px-4 py-3.5 text-sm font-medium text-slate-500 hover:bg-slate-100 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
          >
            Cancelar
          </button>
        )}
      </div>

      {/* Mensagem de erro */}
      {status === "error" && (
        <p className="mt-2 text-center text-sm text-red-600" role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
