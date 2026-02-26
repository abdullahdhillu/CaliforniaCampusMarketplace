import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { getProduct } from "../lib/api";

export default function ProductDetails() {
  const { slug, id } = useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ["product", slug, id],
    queryFn: () => getProduct({ slug, id }),
    enabled: !!slug && !!id,
  });

  if (isLoading) return (
    <div className="flex h-64 items-center justify-center rounded-xl border bg-white">
      <div className="text-gray-600">Loading…</div>
    </div>
  );
  if (error) return (
    <div className="rounded-xl border bg-red-50 p-6 text-center">
      <div className="text-red-600">Error loading product.</div>
    </div>
  );
  
  // Your backend might return { product: [...] } or { product: {...} }
  const product = data?.product;

  if (!product) return (
    <div className="rounded-xl border bg-white p-6 text-center">
      <div className="text-gray-600">Not found.</div>
    </div>
  );
  console.log(product);
  
  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link 
        className="inline-flex items-center gap-1 text-sm text-gray-600 transition hover:text-blue-600"
        to={`/campuses/${slug}/products`}
      >
        ← Back to browse
      </Link>

      {/* Main Product Card */}
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Product Image */}
          <div className="bg-gray-100">
            {product.image ? (
              <img
                src={product.image}
                alt={product.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full min-h-[300px] items-center justify-center text-5xl text-gray-300">
                📦
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="p-6">
            {/* Seller Info */}
            {/* Category Badge */}
            {product.category && (
              <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600">
                {product.category}
              </span>
            )}

            {/* Title */}
            <h1 className="mt-3 text-2xl font-bold text-gray-900">
              {product.title}
            </h1>

            {/* Price */}
            <div className="mt-4 text-3xl font-bold text-blue-600">
              ${product.price}
            </div>

            {/* Condition */}
            {product.condition && (
              <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                <span className="font-medium">Condition:</span>
                <span className="rounded-lg bg-gray-100 px-3 py-1">
                  {product.condition}
                </span>
              </div>
            )}

            {/* Campus */}
            {product.campus && (
              <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                <span className="font-medium">Campus:</span>
                <Link 
                  to={`/campuses/${slug}/products`}
                  className="text-blue-600 hover:underline"
                >
                  {product.campus}
                </Link>
              </div>
            )}

            {/* Contact Button */}
            <div className="mt-6 flex gap-3">
              <button className="flex-1 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700">
                Contact Seller
              </button>
              <button className="rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-50">
                Save
              </button>
            </div>

            {/* Description */}
            {product.description && (
              <div className="mt-8 border-t pt-6">
                <h2 className="mb-3 font-semibold text-gray-900">Description</h2>
                <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Posted Date */}
            {product.createdAt && (
              <div className="mt-6 text-xs text-gray-500">
                Posted {new Date(product.createdAt).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Safety Tips */}
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
        <h3 className="mb-2 font-semibold text-amber-800">💡 Safety Tips</h3>
        <ul className="space-y-1 text-sm text-amber-700">
          <li>• Meet in a public place on campus</li>
          <li>• Inspect the item before paying</li>
          <li>• Use secure payment methods</li>
        </ul>
      </div>
    </div>
  );
}
