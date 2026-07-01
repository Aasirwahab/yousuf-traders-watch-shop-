"use client";

import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import { Star, Trash2 } from "lucide-react";
import { addProductImages, deleteProductImage, setPrimaryImage } from "../products/actions";

type Img = { id: string; url: string; role: string; alt: string };

export function ImageManager({ productId, images }: { productId: string; images: Img[] }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function act(fn: () => Promise<{ ok: boolean; error?: string }>) {
    setError(null);
    startTransition(async () => {
      const res = await fn();
      if (!res.ok) setError(res.error ?? "Something went wrong.");
    });
  }

  function onUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    act(async () => {
      const res = await addProductImages(productId, fd);
      if (res.ok) form.reset();
      return res;
    });
  }

  return (
    <div className="rounded-lg border border-[#d9dfdd] bg-white p-5">
      <h2 className="text-lg font-semibold tracking-tight">Images</h2>
      <p className="mt-1 text-sm text-[#667176]">
        Stored on ImageKit. The starred image is the primary shown on cards.
      </p>

      {error ? (
        <p className="mt-3 rounded-lg border border-[#f0c9bd] bg-[#faeadf] px-4 py-2 text-sm font-medium text-[#9a4e27]">
          {error}
        </p>
      ) : null}

      <div className={`mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 ${pending ? "opacity-60" : ""}`}>
        {images.length === 0 ? (
          <p className="col-span-full text-sm text-[#7a8589]">No images yet — add some below.</p>
        ) : (
          images.map((img) => (
            <div key={img.id} className="overflow-hidden rounded-lg border border-[#e1e6e4]">
              <div className="relative aspect-square bg-[#eef2f1]">
                <Image src={img.url} alt={img.alt} fill sizes="200px" className="object-cover" />
                {img.role === "PRIMARY" ? (
                  <span className="absolute left-2 top-2 rounded-md bg-[#101719] px-2 py-0.5 text-[10px] font-semibold text-white">
                    Primary
                  </span>
                ) : null}
              </div>
              <div className="flex items-center justify-between gap-1 p-2">
                <button
                  onClick={() => act(() => setPrimaryImage(img.id))}
                  disabled={img.role === "PRIMARY" || pending}
                  className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-[#0f766e] disabled:opacity-40"
                >
                  <Star size={13} /> Primary
                </button>
                <button
                  onClick={() => {
                    if (confirm("Remove this image?")) act(() => deleteProductImage(img.id));
                  }}
                  disabled={pending}
                  className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-[#9a4e27] disabled:opacity-40"
                >
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <form ref={formRef} onSubmit={onUpload} className="mt-5 flex flex-wrap items-center gap-3 border-t border-[#e1e6e4] pt-5">
        <input
          name="images"
          type="file"
          accept="image/*"
          multiple
          required
          className="block text-sm text-[#485357] file:mr-3 file:rounded-lg file:border-0 file:bg-[#f2f5f4] file:px-4 file:py-2 file:text-sm file:font-medium file:text-[#394246]"
        />
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-10 items-center rounded-lg bg-[#101719] px-4 text-sm font-semibold text-white disabled:opacity-60"
        >
          {pending ? "Uploading…" : "Upload"}
        </button>
      </form>
    </div>
  );
}
