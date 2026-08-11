import { getAdminSession, requireMethod } from "../_lib/auth";
import { createUserClient } from "../_lib/supabase";
import type { ApiRequest, ApiResponse } from "../_lib/types";

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (!requireMethod(req, res, ["PATCH"])) return;

  try {
    const session = await getAdminSession(req, res);

    if (!session.isAdmin || !session.accessToken) {
      res.status(401).json({ error: "يلزم تسجيل دخول الإدارة." });
      return;
    }

    const body = (req.body ?? {}) as { title?: unknown };
    const title = typeof body.title === "string" ? body.title.trim() : "";

    if (title.length < 2 || title.length > 80) {
      res.status(400).json({ error: "العنوان يجب أن يكون بين 2 و80 حرفًا." });
      return;
    }

    const supabase = createUserClient(session.accessToken);
    const { data, error } = await supabase
      .from("content_blocks")
      .update({ text_value: title, updated_at: new Date().toISOString() })
      .eq("page_id", "home")
      .eq("block_key", "home_title")
      .select("text_value")
      .single();

    if (error) {
      res.status(403).json({ error: "لا تملك صلاحية تعديل هذا المحتوى." });
      return;
    }

    res.status(200).json({ title: data.text_value });
  } catch {
    res.status(500).json({ error: "تعذر حفظ العنوان حاليًا." });
  }
}
