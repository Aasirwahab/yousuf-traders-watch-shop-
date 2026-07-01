"use client";

import { useActionState, useState } from "react";
import type { ActionResult } from "../products/actions";
import {
  GENDERS,
  COLLECTIONS,
  CONDITIONS,
  MATERIALS,
  DIALS,
  CATEGORY_TAGS,
} from "@/lib/admin/product-options";

export type ProductInitial = {
  brand: string;
  name: string;
  reference: string;
  slug: string;
  price: number;
  gender: string;
  collection: string;
  condition: string;
  material: string;
  dial: string;
  diameter: number;
  stock: number;
  year: number | null;
  waterResistance: string | null;
  movement: string | null;
  description: string | null;
  published: boolean;
  categoryTags: string[];
};

const inputCls =
  "h-11 w-full rounded-lg border border-[#d5dcda] bg-white px-3 text-sm outline-none focus:border-[#0f766e]";
const labelCls = "block text-sm font-medium text-[#394246]";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function ProductForm({
  action,
  initial,
  submitLabel,
  showImageUpload,
}: {
  action: (state: ActionResult | null, formData: FormData) => Promise<ActionResult>;
  initial?: ProductInitial;
  submitLabel: string;
  showImageUpload: boolean;
}) {
  const [state, formAction, pending] = useActionState(action, null);
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [name, setName] = useState(initial?.name ?? "");

  return (
    <form action={formAction} className="mt-6 space-y-6">
      {state && !state.ok ? (
        <p className="rounded-lg border border-[#f0c9bd] bg-[#faeadf] px-4 py-3 text-sm font-medium text-[#9a4e27]">
          {state.error}
        </p>
      ) : null}

      <div className="grid gap-5 rounded-lg border border-[#d9dfdd] bg-white p-5 md:grid-cols-2">
        <div>
          <label className={labelCls}>Brand</label>
          <input name="brand" defaultValue={initial?.brand} required className={`mt-1.5 ${inputCls}`} />
        </div>
        <div>
          <label className={labelCls}>Name</label>
          <input
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className={`mt-1.5 ${inputCls}`}
          />
        </div>
        <div>
          <label className={labelCls}>Reference</label>
          <input name="reference" defaultValue={initial?.reference} required className={`mt-1.5 ${inputCls}`} />
        </div>
        <div>
          <label className={labelCls}>Slug</label>
          <div className="mt-1.5 flex gap-2">
            <input
              name="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
              placeholder="louis-erard-excellence"
              className={inputCls}
            />
            <button
              type="button"
              onClick={() => setSlug(slugify(name))}
              className="h-11 shrink-0 rounded-lg border border-[#d5dcda] bg-[#f2f5f4] px-3 text-xs font-medium text-[#394246]"
            >
              From name
            </button>
          </div>
        </div>
        <div>
          <label className={labelCls}>Price (LKR, whole rupees)</label>
          <input name="price" type="number" min={0} defaultValue={initial?.price} required className={`mt-1.5 ${inputCls}`} />
        </div>
        <div>
          <label className={labelCls}>Stock</label>
          <input name="stock" type="number" min={0} defaultValue={initial?.stock ?? 1} required className={`mt-1.5 ${inputCls}`} />
        </div>
      </div>

      <div className="grid gap-5 rounded-lg border border-[#d9dfdd] bg-white p-5 md:grid-cols-3">
        <SelectField name="gender" label="Gender" options={GENDERS} value={initial?.gender} />
        <SelectField name="collection" label="Collection" options={COLLECTIONS} value={initial?.collection} />
        <SelectField name="condition" label="Condition" options={CONDITIONS} value={initial?.condition} />
        <SelectField name="material" label="Material" options={MATERIALS} value={initial?.material} />
        <SelectField name="dial" label="Dial" options={DIALS} value={initial?.dial} />
        <div>
          <label className={labelCls}>Diameter (mm)</label>
          <input name="diameter" type="number" min={10} max={100} defaultValue={initial?.diameter ?? 40} required className={`mt-1.5 ${inputCls}`} />
        </div>
        <div>
          <label className={labelCls}>Year (optional)</label>
          <input name="year" type="number" min={1900} max={2100} defaultValue={initial?.year ?? undefined} className={`mt-1.5 ${inputCls}`} />
        </div>
        <div>
          <label className={labelCls}>Water resistance (optional)</label>
          <input name="waterResistance" defaultValue={initial?.waterResistance ?? undefined} placeholder="50 m" className={`mt-1.5 ${inputCls}`} />
        </div>
        <div>
          <label className={labelCls}>Movement (optional)</label>
          <input name="movement" defaultValue={initial?.movement ?? undefined} placeholder="Automatic" className={`mt-1.5 ${inputCls}`} />
        </div>
      </div>

      <div className="rounded-lg border border-[#d9dfdd] bg-white p-5">
        <label className={labelCls}>Description (optional)</label>
        <textarea name="description" defaultValue={initial?.description ?? undefined} rows={4} className={`mt-1.5 w-full rounded-lg border border-[#d5dcda] bg-white px-3 py-2 text-sm outline-none focus:border-[#0f766e]`} />

        <p className={`mt-5 ${labelCls}`}>Category tags</p>
        <div className="mt-2 flex flex-wrap gap-3">
          {CATEGORY_TAGS.map((tag) => (
            <label key={tag} className="inline-flex items-center gap-2 rounded-lg border border-[#d5dcda] bg-[#f7f9f8] px-3 py-2 text-sm">
              <input
                type="checkbox"
                name="categoryTags"
                value={tag}
                defaultChecked={initial?.categoryTags.includes(tag)}
                className="size-4 accent-[#0f766e]"
              />
              {tag}
            </label>
          ))}
        </div>

        <label className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[#394246]">
          <input type="checkbox" name="published" defaultChecked={initial?.published ?? true} className="size-4 accent-[#0f766e]" />
          Published (visible in storefront)
        </label>
      </div>

      {showImageUpload ? (
        <div className="rounded-lg border border-[#d9dfdd] bg-white p-5">
          <label className={labelCls}>Images</label>
          <p className="mt-1 text-xs text-[#7a8589]">
            Uploaded to ImageKit; the first image becomes the primary. Max 8 MB each.
          </p>
          <input
            name="images"
            type="file"
            accept="image/*"
            multiple
            className="mt-3 block w-full text-sm text-[#485357] file:mr-3 file:rounded-lg file:border-0 file:bg-[#101719] file:px-4 file:py-2 file:text-sm file:font-medium file:text-white"
          />
        </div>
      ) : null}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-11 items-center justify-center rounded-lg bg-[#101719] px-6 text-sm font-semibold text-white disabled:opacity-60"
        >
          {pending ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
}

function SelectField({
  name,
  label,
  options,
  value,
}: {
  name: string;
  label: string;
  options: readonly string[];
  value?: string;
}) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <select name={name} defaultValue={value ?? options[0]} className={`mt-1.5 ${inputCls}`}>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
