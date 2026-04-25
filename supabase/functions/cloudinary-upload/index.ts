// Cloudinary signed upload — admin-only.
// Accepts a base64 file, signs the request server-side, uploads to the
// `maddyy` folder, returns the secure_url.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const cloud = Deno.env.get("CLOUDINARY_CLOUD_NAME")!;
const apiKey = Deno.env.get("CLOUDINARY_API_KEY")!;
const apiSecret = Deno.env.get("CLOUDINARY_API_SECRET")!;
const folder = Deno.env.get("CLOUDINARY_FOLDER") ?? "maddyy";

async function sha1(input: string) {
  const buf = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest("SHA-1", buf);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    // ---- Auth: must be admin ----
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ?? Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: userData, error: userErr } = await supabase.auth.getUser();
    if (userErr || !userData?.user?.id) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { data: roleRow } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userData.user.id)
      .eq("role", "admin")
      .maybeSingle();
    if (!roleRow) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ---- Body ----
    const body = await req.json().catch(() => null);
    const fileBase64: string | undefined = body?.file;
    const resourceType: "image" | "video" | "auto" = body?.resource_type ?? "auto";
    if (!fileBase64 || typeof fileBase64 !== "string") {
      return new Response(JSON.stringify({ error: "file (base64 data URI) is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ---- Signed upload ----
    const timestamp = Math.floor(Date.now() / 1000);
    // Params to sign (alphabetical, joined &k=v, then secret).
    const toSign = `folder=${folder}&timestamp=${timestamp}`;
    const signature = await sha1(toSign + apiSecret);

    const form = new FormData();
    form.append("file", fileBase64);
    form.append("api_key", apiKey);
    form.append("timestamp", String(timestamp));
    form.append("folder", folder);
    form.append("signature", signature);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloud}/${resourceType}/upload`,
      { method: "POST", body: form },
    );
    const json = await res.json();
    if (!res.ok) {
      return new Response(JSON.stringify({ error: json.error?.message ?? "Upload failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        url: json.secure_url,
        public_id: json.public_id,
        resource_type: json.resource_type,
        bytes: json.bytes,
        width: json.width,
        height: json.height,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
