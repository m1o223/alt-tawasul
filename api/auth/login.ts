import { clearSessionCookies, setSessionCookies } from "../_lib/cookies";
import { getAdminSession, requireMethod } from "../_lib/auth";
import { createPublicClient } from "../_lib/supabase";
import type { ApiRequest, ApiResponse } from "../_lib/types";

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (!requireMethod(req, res, ["POST"])) return;

  try {
    const { email, password } = (req.body ?? {}) as { email?: unknown; password?: unknown };

    if (typeof email !== "string" || typeof password !== "string") {
      res.status(400).json({ error: "يرجى إدخال البريد الإلكتروني وكلمة المرور." });
      return;
    }

    const supabase = createPublicClient();
    const login = await supabase.auth.signInWithPassword({ email, password });

    if (login.error || !login.data.session) {
      res.status(401).json({ error: "بيانات الدخول غير صحيحة." });
      return;
    }

    setSessionCookies(
      res,
      login.data.session.access_token,
      login.data.session.refresh_token,
      login.data.session.expires_in ?? 3600,
    );

    const sessionReq = {
      ...req,
      headers: {
        ...req.headers,
        cookie: `alt_tawasul_access=${encodeURIComponent(login.data.session.access_token)}; alt_tawasul_refresh=${encodeURIComponent(login.data.session.refresh_token)}`,
      },
    } as ApiRequest;
    const admin = await getAdminSession(sessionReq);

    if (!admin.isAdmin) {
      clearSessionCookies(res);
      res.status(403).json({ error: "هذا الحساب لا يملك صلاحية الإدارة." });
      return;
    }

    res.status(200).json({ user: { email: login.data.user?.email ?? "" }, isAdmin: true });
  } catch {
    res.status(500).json({ error: "تعذر تسجيل الدخول حاليًا." });
  }
}
