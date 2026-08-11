import { getAdminSession, requireMethod } from "../_lib/auth";
import type { ApiRequest, ApiResponse } from "../_lib/types";

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (!requireMethod(req, res, ["GET"])) return;

  try {
    const session = await getAdminSession(req, res);

    res.status(200).json({
      isAdmin: session.isAdmin,
      user: session.user ? { email: session.user.email ?? "" } : null,
    });
  } catch {
    res.status(200).json({ isAdmin: false, user: null });
  }
}
