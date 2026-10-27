import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { Landing } from "@/components/landing/Landing";

/**
 * Raíz del sitio, compartida por dos dominios en el mismo despliegue:
 *  - app.bettersport.cl  → la plataforma (dashboard con sesión, login sin ella).
 *  - www.bettersport.cl  → la web pública.
 * El resto de las rutas (/login, /dashboard, …) funciona igual en ambos.
 */
export default async function RootPage() {
  const host = (await headers()).get("host") ?? "";
  const isPlatformHost = host.startsWith("app.");

  if (isPlatformHost) {
    const user = await getCurrentUser();
    redirect(user ? "/dashboard" : "/login");
  }

  return <Landing />;
}
