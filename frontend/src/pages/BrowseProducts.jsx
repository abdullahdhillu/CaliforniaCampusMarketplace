import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { listProducts } from "../lib/api";

function cleanParams(obj) {
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null) continue;
    if (typeof v === "string" && v.trim() === "") continue;
    out[k] = v;
  }
  return out;
}

export default function BrowseProducts() {
  const { slug } = useParams();
  const [sp, setSp] = useSearchParams();

  // Read current URL params
  const q = sp.get("q") || "";
  const category = sp.get("category") || "";
  const min = sp.get("min") || "";
  const max = sp.get("max") || "";
  const page = Number(sp.get("page") || 1);
  const limit = 20;

  // Build query input for API
  const queryInput = useMemo(
    () => ({
      slug,
      q: q || undefined,
      category: category || undefined,
      min: min || undefined,
      max: max || undefined,
      page,
      limit,
    }),
    [slug, q, category, min, max, page]
  );

  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ["products", queryInput],
    queryFn: () => listProducts(queryInput),
    enabled: !!slug,
    keepPreviousData: true,
  });

  const items = data?.items ?? [];
  const hasMore = !!data?.hasMore;

  function updateParams(next, options = { resetPage: true }) {
    const merged = {
      q,
      category,
      min,
      max,
      page,
      ...next,
    };

    if (options.resetPage) merged.page = 1;

    const cleaned = cleanParams(merged);
    // URLSearchParams expects strings
    const asStrings = Object.fromEntries(
      Object.entries(cleaned).map(([k, v]) => [k, String(v)])
    );
    setSp(asStrings);
  }

  function onSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    updateParams(
      {
        q: form.get("q") || "",
        category: form.get("category") || "",
        min: form.get("min") || "",
        max: form.get("max") || "",
      },
      { resetPage: true }
    );
  }

  function onClear() {
    setSp({}); // clears all query params
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-xl font-semibold">Error loading products</div>
        <pre className="mt-3 rounded-lg border p-3 text-sm whitespace-pre-wrap">
          {JSON.stringify(
            {
              message: error.message,
              status: error?.response?.status,
              data: error?.response?.data,
              url: error?.config?.baseURL + error?.config?.url,
            },
            null,
            2
          )}
        </pre>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Browse Products</h1>
          <p className="text-sm text-gray-600">
            Campus: <span className="font-medium">{slug}</span>
          </p>
        </div>

        {isFetching && (
          <div className="text-sm text-gray-600">Updating…</div>
        )}
      </div>

      {/* Filters */}
      <form
        onSubmit={onSubmit}
        className="mt-6 rounded-xl border bg-white p-4"
      >
        <div className="grid gap-3 md:grid-cols-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium">Search</label>
            <input
              name="q"
              defaultValue={q}
              placeholder="Search (e.g., bike, desk, hoodie)"
              className="mt-1 w-full rounded-lg border px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Category</label>
            <select
              name="category"
              defaultValue={category}
              className="mt-1 w-full rounded-lg border px-3 py-2"
            >
              <option value="">All</option>
              <option value="electronics">Electronics</option>
              <option value="furniture">Furniture</option>
              <option value="books">Books</option>
              <option value="clothing">Clothing</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium">Min $</label>
              <input
                name="min"
                defaultValue={min}
                inputMode="numeric"
                placeholder="0"
                className="mt-1 w-full rounded-lg border px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Max $</label>
              <input
                name="max"
                defaultValue={max}
                inputMode="numeric"
                placeholder="500"
                className="mt-1 w-full rounded-lg border px-3 py-2"
              />
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="submit"
            className="rounded-lg border px-4 py-2 font-medium hover:bg-gray-50"
          >
            Apply
          </button>
          <button
            type="button"
            onClick={onClear}
            className="rounded-lg border px-4 py-2 hover:bg-gray-50"
          >
            Clear
          </button>

          <div className="ml-auto text-sm text-gray-600">
            Page {page}
            {data?.page ? ` (server: ${data.page})` : ""}
          </div>
        </div>
      </form>

      {/* Results */}
      <div className="mt-6">
        {isLoading ? (
          <div className="text-gray-600">Loading…</div>
        ) : items.length === 0 ? (
          <div className="rounded-xl border p-6 text-gray-600">
            No products found.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((p) => (
              <div key={p._id} className="rounded-xl border p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="font-medium">{p.title}</div>
                  <div className="shrink-0 font-semibold">${p.price}</div>
                </div>

                {p.category && (
                  <div className="mt-2 text-sm text-gray-600">
                    Category: {p.category}
                  </div>
                )}

                {p.description && (
                  <p className="mt-3 line-clamp-3 text-sm text-gray-700">
                    {p.description}
                  </p>
                )}

                <div className="mt-4 text-xs text-gray-500">
                  ID: {p._id}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="mt-8 flex items-center justify-between">
        <button
          className="rounded-lg border px-4 py-2 disabled:opacity-50"
          disabled={page <= 1 || isFetching}
          onClick={() => updateParams({ page: page - 1 }, { resetPage: false })}
        >
          Prev
        </button>

        <button
          className="rounded-lg border px-4 py-2 disabled:opacity-50"
          disabled={!hasMore || isFetching}
          onClick={() => updateParams({ page: page + 1 }, { resetPage: false })}
        >
          Next
        </button>
      </div>
    </div>
  );
}
