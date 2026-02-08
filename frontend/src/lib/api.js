import axios from "axios";

const baseURL = import.meta.env?.VITE_API_URL || "http://localhost:5000";

export const api = axios.create({ baseURL });

console.log("API baseURL:", baseURL);

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}); // sets the token in authorization

// GET /api/campuses/:slug/products
export async function listProducts({
  slug,
  q,
  category,
  min,
  max,
  page,
  limit,
} = {}) {
  if (!slug) throw new Error("listProducts requires a campus slug");
  const params = {};
  if (q) params.q = q;
  if (category) params.category = category;
  if (min !== undefined && min !== null && min !== "") params.min = min;
  if (max !== undefined && max !== null && max !== "") params.max = max;
  if (page) params.page = page;
  if (limit) params.limit = limit;

  const res = await api.get(`/api/campuses/${slug}/products`, { params });
  console.log(res);
  return res.data; // { items, page, hasMore }
}

export async function getProduct({ slug, id } = {}) {
  if (!slug || !id) throw new Error("getProduct requires { slug, id }");

  const res = await api.get(`/api/campuses/${slug}/products/${id}`);
  return res.data; // { product: [...] } (per your controller)
}

export async function createProduct({ slug, payload } = {}) {
  if (!slug) throw new Error("createProduct requires a campus slug");
  const res = await api.post(`/api/campuses/${slug}/products/createProduct`, payload);
  return res.data;
}

export async function deleteProduct({ slug, id } = {}) {
  if (!slug || !id) throw new Error("deleteProduct requires { slug, id }");
  const res = await api.delete(`/api/campuses/${slug}/products/deleteProduct/${id}`);
  return res.data;
}

export async function login(credentials) {
  const res = await api.post("/api/user/login", credentials);
  localStorage.setItem("token", res.data.token);
  return res.data;
}
