 

import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HomeSearchBar() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  function onSubmit(e) {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    navigate(`/products?q=${encodeURIComponent(q)}&page=1`);
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto flex max-w-xl overflow-hidden rounded-lg bg-white shadow-lg"
    >
      <input
        type="text"
        placeholder="Search for products..."
        className="flex-1 px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button
        type="submit"
        className="bg-indigo-600 px-6 py-3 font-medium text-white transition hover:bg-indigo-700"
      >
        Search
      </button>
    </form>
  );
}