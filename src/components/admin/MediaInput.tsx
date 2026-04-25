import { useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";

type Props = {
  value: string;
  onChange: (url: string) => void;
  resourceType?: "image" | "video" | "auto";
  label?: string;
  accept?: string;
};

/**
 * Cloudinary upload field. Accepts a file → base64 → calls the
 * `cloudinary-upload` edge function (admin-gated) → writes secure_url
 * back through onChange. Also supports pasting a URL directly.
 */
export const MediaInput = ({
  value,
  onChange,
  resourceType = "auto",
  label,
  accept = "image/*,video/*",
}: Props) => {
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const onFile = async (file: File) => {
    if (file.size > 50 * 1024 * 1024) {
      toast.error("Max file size is 50MB");
      return;
    }
    setBusy(true);
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve(r.result as string);
        r.onerror = () => reject(r.error);
        r.readAsDataURL(file);
      });
      const { data, error } = await supabase.functions.invoke("cloudinary-upload", {
        body: { file: dataUrl, resource_type: resourceType },
      });
      if (error) throw error;
      if ((data as any)?.url) {
        onChange((data as any).url);
        toast.success("Uploaded");
      } else {
        throw new Error((data as any)?.error ?? "Upload failed");
      }
    } catch (e: any) {
      toast.error(e?.message ?? "Upload failed");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      {label && <p className="eyebrow text-muted-foreground">{label}</p>}
      <div className="flex items-center gap-2">
        <Input
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://… or upload"
          className="flex-1 bg-background"
        />
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onFile(f);
          }}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
        </Button>
        {value && (
          <Button type="button" variant="ghost" size="sm" onClick={() => onChange("")}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      {value && (
        <div className="rounded border border-border overflow-hidden bg-background max-w-xs">
          {/\.(mp4|webm|mov)/i.test(value) || resourceType === "video" ? (
            <video src={value} className="w-full h-32 object-cover" muted />
          ) : (
            <img src={value} alt="" className="w-full h-32 object-cover" />
          )}
        </div>
      )}
    </div>
  );
};
