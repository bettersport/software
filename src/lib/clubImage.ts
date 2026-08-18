/** Resuelve la URL visible de logo/banner: data-URL antigua, URL http, o clave del volumen → endpoint. */
export function clubImageUrl(clubId: string, kind: "logo" | "banner", value: string | null | undefined, v?: number | string): string | null {
  if (!value) return null;
  if (value.startsWith("data:") || value.startsWith("http")) return value;
  return `/api/clubs/${clubId}/image/${kind}${v ? `?v=${v}` : ""}`;
}
