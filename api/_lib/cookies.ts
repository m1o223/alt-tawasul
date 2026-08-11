import type { ApiRequest, ApiResponse } from "./types";

export const accessCookieName = "alt_tawasul_access";
export const refreshCookieName = "alt_tawasul_refresh";

export function getCookie(req: ApiRequest, name: string) {
  const header = req.headers.cookie;

  if (!header) return null;

  const cookieHeader = Array.isArray(header) ? header.join(";") : header;
  const value = cookieHeader
    .split(";")
    .map((cookie: string) => cookie.trim())
    .find((cookie: string) => cookie.startsWith(`${name}=`));

  if (!value) return null;

  return decodeURIComponent(value.slice(name.length + 1));
}

export function setSessionCookies(
  res: ApiResponse,
  accessToken: string,
  refreshToken: string,
  maxAgeSeconds: number,
) {
  const secure = process.env.NODE_ENV === "production" ? " Secure;" : "";

  res.setHeader("Set-Cookie", [
    `${accessCookieName}=${encodeURIComponent(accessToken)}; Path=/; HttpOnly;${secure} SameSite=Lax; Max-Age=${maxAgeSeconds}`,
    `${refreshCookieName}=${encodeURIComponent(refreshToken)}; Path=/; HttpOnly;${secure} SameSite=Lax; Max-Age=604800`,
  ]);
}

export function clearSessionCookies(res: ApiResponse) {
  res.setHeader("Set-Cookie", [
    `${accessCookieName}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`,
    `${refreshCookieName}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`,
    `${accessCookieName}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`,
    `${refreshCookieName}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`,
  ]);
}
