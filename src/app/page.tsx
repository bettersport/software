import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

/**
 * Raíz del sitio: el login es la página principal (ya no hay landing).
 * Si la visita trae sesión activa, va directo al dashboard.
 */
export default async function RootPage() {
  const user = await getCurrentUser();
  redirect(user ? "/dashboard" : "/login");
}
