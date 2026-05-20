// ===== TYPES =====

export type UserRole = "admin" | "club" | "brand" | "solucion" | "hincha";

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

// ===== FAN ZONE TYPES =====

export type FanTierName = "bronce" | "plata" | "oro" | "leyenda";

export interface FanTier {
  name: FanTierName;
  label: string;
  emoji: string;
  minPoints: number;
  maxPoints: number;
  color: string;
  glowColor: string;
}

export type FanActionCategory = "fisica" | "digital" | "social";

export interface FanAction {
  id: string;
  title: string;
  description: string;
  points: number;
  category: FanActionCategory;
  icon: string;
  frequency: string;
  completed?: boolean;
}

export type FanRewardType = "club" | "sponsor" | "badge";

export interface FanReward {
  id: string;
  name: string;
  description: string;
  points: number;
  type: FanRewardType;
  icon: string;
  available: boolean;
  quota?: number;
  claimed?: boolean;
}

export interface FanProfile {
  id: string;
  name: string;
  alias?: string;
  clubId: string;
  clubName: string;
  country: string;
  flag: string;
  points: number;
  tier: FanTierName;
  actionsCompleted: number;
  badgesEarned: number;
  rankingPosition: number;
  joinedAt: string;
  completedActionIds: string[];
  claimedRewardIds: string[];
}

export interface FanZoneStats {
  totalFans: number;
  activeFans: number;
  participationRate: number;
  totalActions: number;
  collectiveScore: number;
  rewardsRedeemed: number;
  npsScore: number;
  churnRate: number;
  goldPlusFans: number;
}

// ===== BRAND ONBOARDING TYPES =====

export type SponsorshipObjective =
  | "reconocimiento_marca"
  | "engagement_digital"
  | "generacion_leads"
  | "ventas_directas"
  | "reputacion_esg"
  | "fidelizacion"
  | "lanzamiento_producto"
  | "expansion_mercados";

export type DataSource =
  | "redes_sociales"
  | "web_analytics"
  | "crm"
  | "medios_tradicionales"
  | "datos_evento"
  | "encuestas";

export interface BrandKPI {
  id: string;
  name: string;
  category: "visibilidad" | "engagement" | "reputacion" | "conversion";
  badge: string;
  enabled: boolean;
}

export interface BrandConfig {
  brandName: string;
  industry: string;
  country: string;
  website: string;
  objectives: SponsorshipObjective[];
  sponsorshipName: string;
  sponsorshipType: string;
  startDate: string;
  endDate: string;
  budget: string;
  territory: string;
  sports: string[];
  dataSources: DataSource[];
  kpis: BrandKPI[];
}
