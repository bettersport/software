import type { ESGProject, Club } from "./types";

/** Maps each project category to the ESG dimension it influences */
const CATEGORY_DIMENSION: Record<string, "environmental" | "social" | "governance"> = {
  huella_carbono:   "environmental",
  huella_hidrica:   "environmental",
  gestion_residuos: "environmental",
  educacion:        "social",
  inclusion:        "social",
  equidad_genero:   "governance",
};

/**
 * Maximum bonus points (per dimension) that projects can contribute.
 * Each active project contributes up to MAX_BONUS / 3 points at 100% progress.
 */
const MAX_BONUS = 10;

/**
 * Recomputes a club's ESG scores based on its active / completed projects.
 * Returns a new Club object — does NOT mutate the base.
 */
export function computeClubScore(baseClub: Club, projects: ESGProject[]): Club {
  const active = projects.filter(
    (p) => p.status === "in_progress" || p.status === "completed"
  );

  const bonus: Record<string, number> = {
    environmental: 0,
    social: 0,
    governance: 0,
  };

  for (const p of active) {
    const dim = CATEGORY_DIMENSION[p.category];
    if (dim) {
      // Each project can add up to MAX_BONUS/3 pts at 100% progress
      bonus[dim] += (p.progress / 100) * (MAX_BONUS / 3);
    }
  }

  const environmental = Math.min(
    100,
    Math.round(baseClub.environmental + Math.min(MAX_BONUS, bonus.environmental))
  );
  const social = Math.min(
    100,
    Math.round(baseClub.social + Math.min(MAX_BONUS, bonus.social))
  );
  const governance = Math.min(
    100,
    Math.round(baseClub.governance + Math.min(MAX_BONUS, bonus.governance))
  );
  const transparency = baseClub.transparency;

  const esgScore =
    Math.round(
      (environmental * 0.4 + social * 0.3 + governance * 0.2 + transparency * 0.1) * 10
    ) / 10;

  return { ...baseClub, environmental, social, governance, esgScore };
}
