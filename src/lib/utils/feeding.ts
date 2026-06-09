/**
 * Utilitários de formatação e lógica de alimentação.
 * Centraliza regras usadas no dashboard e futuros perfis de animal.
 */

/** Rótulos amigáveis para espécie */
export const speciesLabels = {
  dog: "Cão",
  cat: "Gato",
} as const;

/**
 * Calcula ha quanto tempo o animal foi alimentado e retorna texto legível.
 * Ex.: "há 2 horas", "há 3 dias", "nunca registrado"
 */
export function formatLastFed(lastFedAt: string | null): string {
  if (!lastFedAt) {
    return "Nunca registrado";
  }

  const fedDate = new Date(lastFedAt);
  const now = new Date();
  const diffMs = now.getTime() - fedDate.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) {
    return "agora mesmo";
  }
  if (diffMinutes < 60) {
    return `há ${diffMinutes} min`;
  }
  if (diffHours < 24) {
    return `há ${diffHours}h`;
  }
  return `há ${diffDays} dia${diffDays > 1 ? "s" : ""}`;
}

/**
 * Indica se o animal pode precisar de alimentação com urgência.
 * Regra MVP: mais de 12 horas desde a última refeição (ou nunca alimentado).
 */
export function needsFeedingAttention(lastFedAt: string | null): boolean {
  if (!lastFedAt) {
    return true;
  }

  const hoursSince =
    (Date.now() - new Date(lastFedAt).getTime()) / (1000 * 60 * 60);
  return hoursSince >= 12;
}

/**
 * Retorna iniciais do nome para avatar placeholder quando não há foto.
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
