import { useMemo } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { CampusSearch } from "../components/CampusSearch";
import useCampuses from "../hooks/useCampuses";
import useProducts from "../hooks/useProducts";
import { cleanParams } from "../utils/utilities";


export default function BrowseProducts() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [searchParams, setsearchParams] = useSearchParams();

  // Read current URL params
  const q = searchParams.get("q") || "";
  const campus = searchParams.get("campus") || "";
  const category = searchParams.get("category") || "";
  const min = searchParams.get("min") || "";
  const max = searchParams.get("max") || "";
  const page = Number(searchParams.get("page") || 1);
  const limit = 20;

  // Build query input for API
  const queryInput = useMemo( //useMemo protects me from irrelevent renders by only rendering when any of the dependencies change
    () => ({
      slug,
      campus: campus || undefined, // ✅ global filter
      q: q || undefined,
      category: category || undefined,
      min: min || undefined,
      max: max || undefined,
      page,
      limit,
    }),
    [slug, q, campus, category, min, max, page]
  );

  const { data: products, isLoading, isFetching, error } = useProducts(queryInput)
  const { data: campuses, error: campusesErrors } = useCampuses();
  if (campusesErrors) console.log(campusesErrors);


  const items = products?.items ?? [];
  const hasMore = !!products?.hasMore;

  function updateParams(next, options = { resetPage: true }) {
    const merged = {
      q,
      campus,
      category,
      min,
      max,
      page,
      ...next,
    };

    if (options.resetPage) merged.page = 1;

    const cleaned = cleanParams(merged); // removes the properties that are either undefined, null or empty
    // URLSearchParams expects strings
    const asStrings = Object.fromEntries(
      Object.entries(cleaned).map(([k, v]) => [k, String(v)])
    );
    setsearchParams(asStrings);
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
    setsearchParams({}); // clears all query params
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
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Browse Products</h1>
          <div className="mt-2 flex items-center gap-2">
            <label className="text-sm text-gray-600">Campus:</label>
            {campuses?.length > 0 ? (
              <CampusSearch
                key={slug ?? "global"}
                value={slug ?? campus}             // slug if campus-page, else query campus
                campuses={campuses || []}
                onChange={(newSlug) => {
                  if (slug) {
                    // campus page -> navigate to new campus page
                    const qs = searchParams.toString();
                    navigate(`/campuses/${newSlug}/products${qs ? `?${qs}` : ""}`);
                  } else {
                    // global page -> set campus filter param
                    updateParams({ campus: newSlug || "" }, { resetPage: true });
                  }
                }}
              />
            ) : (
              <span className="text-sm text-gray-500">Loading...</span>
            )}
          </div>
        </div>

        {isFetching && (
          <div className="text-sm text-gray-600">Updating…</div>
        )}
      </div>

      {/* Filters */}
      <form
        onSubmit={onSubmit}
        className="rounded-xl border bg-white p-6 shadow-sm"
      >
        <div className="grid gap-4 md:grid-cols-4">
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Search
            </label>
            <input
              name="q"
              defaultValue={q}
              placeholder="Search (e.g., bike, desk, hoodie)"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              name="category"
              defaultValue={category}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
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
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Min $
              </label>
              <input
                name="min"
                defaultValue={min}
                inputMode="numeric"
                placeholder="0"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Max $
              </label>
              <input
                name="max"
                defaultValue={max}
                inputMode="numeric"
                placeholder="500"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700"
          >
            Apply Filters
          </button>
          <button
            type="button"
            onClick={onClear}
            className="rounded-lg border border-gray-300 px-5 py-2.5 font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Clear
          </button>

          <div className="ml-auto text-sm text-gray-600">
            Page {page}
            {products?.page ? ` (server: ${products.page})` : ""}
          </div>
        </div>
      </form>

      {/* Results */}
      <div>
        {isLoading ? (
          <div className="flex h-40 items-center justify-center rounded-xl border bg-gray-50 text-gray-600">
            Loading…
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-xl border bg-white p-12 text-center shadow-sm">
            <div className="text-4xl mb-3">📦</div>
            <div className="text-gray-600">No products found.</div>
            <p className="mt-2 text-sm text-gray-500">Try adjusting your filters or check back later.</p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((p) => (
              <Link
                key={p._id}
                to={`/campuses/${p.campusID?.slug || slug}/products/${p._id}`}
                className="group overflow-hidden rounded-xl border bg-white shadow-sm transition hover:shadow-lg"
              >
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={p.title}
                      className="h-full w-full object-cover transition group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-4xl text-gray-300">
                      📦
                    </div>
                  )}
                  {p.category && (
                    <span className="absolute bottom-2 left-2 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-gray-700">
                      {p.category}
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="mb-1 font-medium text-gray-900 line-clamp-1 group-hover:text-blue-600">
                    {p.title}
                  </h3>
                  <p className="mb-3 text-sm text-gray-600 line-clamp-2">
                    {p.description || "No description provided"}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-blue-600">
                      ${p.price}
                    </span>
                    <span className="text-xs text-gray-500">
                      {p._id.slice(-6)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {items.length > 0 && (
        <div className="flex items-center justify-center gap-4">
          <button
            className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 hover:border-gray-400 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={page <= 1 || isFetching}
            onClick={() => updateParams({ page: page - 1 }, { resetPage: false })}
          >
            ← Previous
          </button>

          <span className="text-sm text-gray-600">
            Page {page}
          </span>

          <button
            className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 hover:border-gray-400 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!hasMore || isFetching}
            onClick={() => updateParams({ page: page + 1 }, { resetPage: false })}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
