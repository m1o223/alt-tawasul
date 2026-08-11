import { getCookie, refreshCookieName, clearSessionCookies } from "../_lib/cookies";
import { requireMethod } from "../_lib/auth";
import { createPublicClient } from "../_lib/supabase";
import type { ApiRequest, ApiResponse } from "../_lib/types";

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (!requireMethod(req, res, ["POST"])) return;

  try {
    const refreshToken = getCookie(req, refreshCookieName);

    if (refreshToken) {
      await createPublicClient().auth.refreshSession({ refresh_token: refreshToken });
      await createPublicClient().auth.signOut();
    }

    clearSessionCookies(res);
    res.status(200).json({ ok: true });
  } catch {
    clearSessionCookies(res);
    res.status(200).json({ ok: true });
  }
}
