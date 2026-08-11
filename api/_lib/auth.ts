import { accessCookieName, getCookie, refreshCookieName, setSessionCookies } from "./cookies";
import { createPublicClient, createUserClient } from "./supabase";
import type { ApiRequest, ApiResponse } from "./types";

export async function getAdminSession(req: ApiRequest, res?: ApiResponse) {
  let accessToken = getCookie(req, accessCookieName);
  const refreshToken = getCookie(req, refreshCookieName);

  if (!accessToken && !refreshToken) {
    return { isAdmin: false as const, user: null, accessToken: null };
  }

  const publicClient = createPublicClient();

  if (!accessToken && refreshToken) {
    const refreshed = await publicClient.auth.refreshSession({ refresh_token: refreshToken });

    if (refreshed.error || !refreshed.data.session) {
      return { isAdmin: false as const, user: null, accessToken: null };
    }

    accessToken = refreshed.data.session.access_token;

    if (res) {
      setSessionCookies(
        res,
        refreshed.data.session.access_token,
        refreshed.data.session.refresh_token,
        refreshed.data.session.expires_in ?? 3600,
      );
    }
  }

  if (!accessToken) {
    return { isAdmin: false as const, user: null, accessToken: null };
  }

  let userClient = createUserClient(accessToken);
  let userResponse = await userClient.auth.getUser(accessToken);

  if (userResponse.error && refreshToken) {
    const refreshed = await publicClient.auth.refreshSession({ refresh_token: refreshToken });

    if (refreshed.error || !refreshed.data.session) {
      return { isAdmin: false as const, user: null, accessToken: null };
    }

    accessToken = refreshed.data.session.access_token;
    userClient = createUserClient(accessToken);
    userResponse = await userClient.auth.getUser(accessToken);

    if (res) {
      setSessionCookies(
        res,
        refreshed.data.session.access_token,
        refreshed.data.session.refresh_token,
        refreshed.data.session.expires_in ?? 3600,
      );
    }
  }

  const user = userResponse.data.user;

  if (!user) {
    return { isAdmin: false as const, user: null, accessToken: null };
  }

  const adminResponse = await userClient
    .from("admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (adminResponse.error || !adminResponse.data) {
    return { isAdmin: false as const, user: null, accessToken };
  }

  return { isAdmin: true as const, user, accessToken };
}

export function requireMethod(req: ApiRequest, res: ApiResponse, methods: string[]) {
  if (!req.method || !methods.includes(req.method)) {
    res.setHeader("Allow", methods.join(", "));
    res.status(405).json({ error: "Method not allowed." });
    return false;
  }

  return true;
}
