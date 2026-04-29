// ===== TYPES =====

export type UserRole = "admin" | "club" | "brand" | "manager" | "auditor" | "solucion" | "hincha";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  club?: string;
  country?: string;
  clubId?: string;
}

export interface Club {
  id: string;
  name: string;
  sport: string;
  country: string;
  flag: string;
  logo?: string;
  esgScore: number;
  ranking: number;
  environmental: number;
  social: number;
  governance: number;
  transparency: number;
  members: number;
  founded: number;
  description?: string;
}

export interface ESGProject {
  id: string;
  title: string;
  category: ESGCategory;
  status: "planning" | "in_progress" | "completed" | "paused";
  progress: number;
  budget: number;
  spent: number;
  startDate: string;
  endDate: string;
  responsible: string;
  description: string;
  milestones: Milestone[];
  kpis: KPI[];
}

export interface Milestone {
  id: string;
  title: string;
  date: string;
  completed: boolean;
}

export interface KPI {
  id: string;
  name: string;
  current: number;
  target: number;
  unit: string;
  trend: "up" | "down" | "stable";
}

export type ESGCategory =
  | "huella_hidrica"
  | "huella_carbono"
  | "gestion_residuos"
  | "educacion"
  | "inclusion"
  | "equidad_genero";

export interface Event {
  id: string;
  title: string;
  clubId: string;
  clubName: string;
  country: string;
  flag: string;
  sport: string;
  category: ESGCategory;
  image: string;
  description: string;
  sustainableImpact: string;
  budget: number;
  funded: number;
  remaining: number;
  daysLeft: number;
  sponsoredBy?: string[];
  mediaPartner?: string;
  sealEsg?: boolean;
  featured?: boolean;
  audience: number;
  status: "open" | "negotiating" | "funded" | "closed";
}

export interface Proposal {
  id: string;
  eventId: string;
  brandId: string;
  brandName: string;
  amount: number;
  status: "received" | "negotiating" | "accepted" | "rejected";
  message: string;
  createdAt: string;
}

export interface Document {
  id: string;
  name: string;
  type: "pdf" | "xls" | "img" | "doc";
  category: string;
  size: string;
  uploadedAt: string;
  uploadedBy: string;
  version: string;
}

export interface Notification {
  id: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export type SolutionCategory =
  | "eficiencia_hidrica"
  | "eficiencia_energetica"
  | "gestion_residuos"
  | "educacion_ambiental"
  | "impacto_social"
  | "movilidad_sostenible";

export interface SolutionProvider {
  id: string;
  name: string;
  logo?: string;
  initials: string;
  color: string;
  category: SolutionCategory;
  country: string;
  flag: string;
  description: string;
  services: string[];
  projectsCount: number;
  associatedBrand?: string;
  associatedBrandLogo?: string;
  associatedClub?: string;
  associatedClubLogo?: string;
  stars: number; // 1–5
  verified: boolean;
  featured?: boolean;
  tags?: string[];
}
