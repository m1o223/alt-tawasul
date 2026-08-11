import { requireMethod } from "../_lib/auth";
import { createPublicClient } from "../_lib/supabase";
import type { ApiRequest, ApiResponse } from "../_lib/types";

const fallbackTitle = "التواصل البديل";

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (!requireMethod(req, res, ["GET"])) return;

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("content_blocks")
      .select("text_value")
      .eq("page_id", "home")
      .eq("block_key", "home_title")
      .eq("status", "published")
      .maybeSingle();

    if (error) {
      res.status(200).json({ title: fallbackTitle, source: "fallback" });
      return;
    }

    res.status(200).json({ title: data?.text_value ?? fallbackTitle, source: data ? "database" : "fallback" });
  } catch {
    res.status(200).json({ title: fallbackTitle, source: "fallback" });
  }
}
