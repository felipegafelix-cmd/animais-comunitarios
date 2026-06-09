/**
 * Tipos centrais do domínio — espelham o schema PostgreSQL do Supabase.
 * Manter sincronizado com supabase/migrations/001_initial_schema.sql
 */

/** Espécie do animal comunitário */
export type Species = "dog" | "cat";

/** Tipo de registro no diário de saúde */
export type HealthRecordType = "vaccine" | "dewormer";

/** Registro base de um animal (tabela `animals`) */
export interface Animal {
  id: string;
  name: string;
  species: Species;
  photo_url: string | null;
  location_description: string;
  location_lat: number | null;
  location_lng: number | null;
  is_neutered: boolean;
  is_emergency: boolean;
  emergency_note: string | null;
  created_at: string;
  updated_at: string;
}

/** Entrada de alimentação (tabela `feeding_logs`) */
export interface FeedingLog {
  id: string;
  animal_id: string;
  fed_at: string;
  fed_by_name: string | null;
  notes: string | null;
}

/** Registro de saúde (tabela `health_records`) */
export interface HealthRecord {
  id: string;
  animal_id: string;
  record_type: HealthRecordType;
  title: string;
  applied_at: string;
  next_due_at: string | null;
  notes: string | null;
  created_at: string;
}

/**
 * Animal enriquecido para o dashboard — inclui última alimentação
 * (view `animals_with_last_feeding` ou join manual)
 */
export interface AnimalWithStatus extends Animal {
  last_fed_at: string | null;
  last_fed_by: string | null;
}
