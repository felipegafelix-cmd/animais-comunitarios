/**
 * Histórico de alimentação — timeline visual dos registros recentes.
 * Exibe "Sem registros" quando o histórico está vazio.
 */
import { Clock, UtensilsCrossed, User } from "lucide-react";
import { formatLastFed } from "@/lib/utils/feeding";
import type { FeedingLog } from "@/types";

interface FeedingHistoryProps {
  logs: FeedingLog[];
}

export function FeedingHistory({ logs }: FeedingHistoryProps) {
  return (
    <section aria-labelledby="historico-heading" className="rounded-3xl bg-white border border-slate-200 shadow-sm p-5">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-700" aria-hidden="true">
          <UtensilsCrossed className="h-4 w-4" />
        </div>
        <h2 id="historico-heading" className="text-base font-semibold text-slate-900">
          Histórico de alimentação
        </h2>
        {logs.length > 0 && (
          <span className="ml-auto text-xs text-slate-400">
            {logs.length} registro{logs.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {logs.length === 0 ? (
        <p className="py-6 text-center text-sm text-slate-400">
          Nenhum registro de alimentação ainda.
        </p>
      ) : (
        <ol className="space-y-3" role="list">
          {logs.map((log, index) => (
            <li
              key={log.id}
              className={`relative flex gap-3 rounded-xl px-3 py-3 text-sm ${
                index === 0
                  ? "bg-teal-50 border border-teal-100"
                  : "bg-slate-50"
              }`}
            >
              {/* Ícone do timeline */}
              <div
                className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                  index === 0
                    ? "bg-teal-600 text-white"
                    : "bg-slate-200 text-slate-500"
                }`}
                aria-hidden="true"
              >
                <UtensilsCrossed className="h-3.5 w-3.5" />
              </div>

              {/* Conteúdo */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <time
                    dateTime={log.fed_at}
                    className="flex items-center gap-1 font-medium text-slate-700"
                  >
                    <Clock className="h-3 w-3" aria-hidden="true" />
                    {formatLastFed(log.fed_at)}
                  </time>
                  {log.fed_by_name && (
                    <span className="flex items-center gap-1 text-slate-500">
                      <User className="h-3 w-3" aria-hidden="true" />
                      {log.fed_by_name}
                    </span>
                  )}
                </div>
                {log.notes && (
                  <p className="mt-1 text-xs text-slate-500">{log.notes}</p>
                )}
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
