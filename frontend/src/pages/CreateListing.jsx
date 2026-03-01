import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CampusSearch } from "../components/CampusSearch";
import { createProduct, listCampuses } from "../lib/api";
import uploadToCloudinary from "../lib/cloudinary";
export default function CreateListing() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    category: "",
    condition: "",
    campus: "",
    description: "",
    images: [],
  });


  const handleImageSelect = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // enforce max 5 total
    const remaining = 5 - formData.images.length;
    const toUpload = files.slice(0, remaining);

    setIsLoading(true);
    setError("");

    try {
      const urls = [];
      for (const f of toUpload) {
        const uploadedUrl = await uploadToCloudinary(f);
        urls.push(uploadedUrl);
      }

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...urls],
      }));
    } catch (err) {
      const msg = err?.response?.data?.error ||     // backend message
        err?.response?.data?.message ||   // fallback if I change the shape
        err.message;                      // axios fallback: "Request failed..."
      setError(msg || "Failed to upload image(s)");
    } finally {
      setIsLoading(false);
      e.target.value = ""; // allow re-selecting same file
    }
  };

  const removeImage = (idx) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx),
    }));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const slug = formData.campus;
      const payload = {
        title: formData.title,
        price: formData.price,
        category: formData.category || "other",
        condition: formData.condition || "good",
        description: formData.description.trim(),
        images: formData.images || [],
        status: "active"
      }
      await createProduct({ slug, payload });
      navigate(`/campuses/${slug}/products`);
    } catch (err) {
      setError(err?.response?.data?.error || err.message || "Failed to create listing");
    } finally {
      setIsLoading(false);
    }
  };

  const { data: campuses, error: campusesErrors } = useQuery({
    queryKey: ["campuses"],
    queryFn: listCampuses,
  })
  if (campusesErrors) console.log(campusesErrors);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <Link to="/campuses/ucla/products" className="text-sm text-gray-600 hover:text-blue-600">
          Back to browse
        </Link>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">Create a Listing</h1>
        <p className="mt-1 text-gray-600">Fill out the details below to list your item</p>
      </div>

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && <p className="text-sm text-red-600">{error}</p>}

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Product title"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Price ($) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">Select</option>
                <option value="electronics">Electronics</option>
                <option value="furniture">Furniture</option>
                <option value="textbooks">Textbooks</option>
                <option value="clothing">Clothing</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Condition *</label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">Select</option>
                <option value="new">New</option>
                <option value="like_new">Like New</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Campus *</label>
              <CampusSearch 
                value={formData.campus} 
                campuses={campuses || []} 
                onChange={(slug) => setFormData(prev => ({ ...prev, campus: slug }))}
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your item"
              required
              rows={4}
              className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Images (up to 5)
            </label>

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageSelect}
              disabled={isLoading || formData.images.length >= 5}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5"
            />

            <p className="mt-2 text-xs text-gray-500">
              Uploads images and saves their URLs.
            </p>

            {formData.images.length > 0 && (
              <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-5">
                {formData.images.map((url, idx) => (
                  <div key={url} className="relative">
                    <img
                      src={url}
                      alt={`Upload ${idx + 1}`}
                      className="h-20 w-20 rounded-lg object-cover border"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute -right-2 -top-2 rounded-full bg-white border px-2 py-0.5 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>


          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? "Creating..." : "Create Listing"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
