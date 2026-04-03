export type Role = "driver" | "parent";

export type StudentStatus = "a_buscar" | "embarcado" | "chegou" | "ausente";

export interface StudentStop {
  id: string;
  nome: string;
  status: StudentStatus;
  latitude: number;
  longitude: number;
  ordem: number;
}

