"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { MEDIA_BUCKET } from "@/lib/supabase/env";
import { fieldError, input, secondaryButton } from "./ui";

// Matches the media bucket's limits in supabase/migrations.
const ACCEPT = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"];
const MAX_BYTES = 5 * 1024 * 1024;

type Props = {
  id: string;
  name: string;
  defaultValue: string;
  required?: boolean;
  invalid?: boolean;
  describedBy?: string;
};

/**
 * Image URL with a preview. "Зураг оруулах" uploads straight from the browser
 * to Supabase Storage (RLS: admins only) and fills in the public URL; the file
 * itself never goes through the form.
 */
export function ImageField({ id, name, defaultValue, required, invalid, describedBy }: Props) {
  const [url, setUrl] = useState(defaultValue);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>();
  const fileRef = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    setError(undefined);
    if (!ACCEPT.includes(file.type)) return setError("JPG, PNG, WebP, AVIF эсвэл GIF зураг сонгоно уу.");
    if (file.size > MAX_BYTES) return setError("Зургийн хэмжээ 5 MB-аас ихгүй байна.");

    setUploading(true);
    try {
      const supabase = createClient();
      const ext = file.type.split("/")[1].replace("jpeg", "jpg");
      const path = `uploads/${crypto.randomUUID()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from(MEDIA_BUCKET)
        .upload(path, file, { contentType: file.type, cacheControl: "31536000", upsert: false });
      if (uploadError) throw uploadError;
      setUrl(supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl);
    } catch (e) {
      setError(`Оруулж чадсангүй: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="flex gap-4 max-sm:flex-col">
      <div className="relative flex aspect-[16/10] w-full shrink-0 items-center justify-center overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100 sm:w-44">
        {url ? (
          <img src={url} alt="" className="size-full object-cover" />
        ) : (
          <span className="text-xs text-neutral-400">Зураггүй</span>
        )}
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70">
            <span className="size-5 animate-spin rounded-full border-2 border-neutral-300 border-t-ink" />
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <input
          id={id}
          name={name}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required={required}
          placeholder="/assets/images/… эсвэл зураг оруулна уу"
          className={input}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
        />
        <div>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className={secondaryButton}
          >
            {uploading ? "Оруулж байна…" : "Зураг оруулах"}
          </button>
          {/* No name: the file is uploaded here, not submitted with the form */}
          <input
            ref={fileRef}
            type="file"
            accept={ACCEPT.join(",")}
            className="sr-only"
            tabIndex={-1}
            aria-hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void upload(file);
            }}
          />
        </div>
        {error && (
          <p role="alert" className={fieldError}>
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
