import { useState } from "react";
import { Link } from "react-router-dom";

const campuses = [
  // UC System
  { name: "UCLA", slug: "ucla" },
  { name: "UC Berkeley", slug: "berkeley" },
  { name: "UC San Diego", slug: "ucsd" },
  { name: "UC Irvine", slug: "uci" },
  { name: "UC Davis", slug: "ucdavis" },
  { name: "UC Santa Barbara", slug: "ucsb" },
  { name: "UC Riverside", slug: "ucr" },
  { name: "UC Santa Cruz", slug: "ucsc" },
  { name: "UC Merced", slug: "ucmerced" },
  { name: "UC San Francisco", slug: "ucsf" },
  // CSU System
  { name: "San Diego State", slug: "sdsu" },
  { name: "San Jose State", slug: "sjsu" },
  { name: "Cal Poly SLO", slug: "calpoly-slo" },
  { name: "Cal State LA", slug: "csula" },
  { name: "Cal State Long Beach", slug: "csulb" },
  { name: "Cal State Fullerton", slug: "csuf" },
  { name: "Cal State Northridge", slug: "csun" },
  { name: "Cal State Sacramento", slug: "csus" },
  { name: "Cal State Fresno", slug: "csufresno" },
  { name: "Cal State San Bernardino", slug: "csusb" },
  { name: "Cal State East Bay", slug: "csueb" },
  { name: "Cal State Dominguez Hills", slug: "csudh" },
  { name: "Cal State San Marcos", slug: "csusm" },
  { name: "Cal State Chico", slug: "csuchico" },
  { name: "Cal State Bakersfield", slug: "csub" },
  { name: "Cal State Stanislaus", slug: "csustan" },
  { name: "Cal State Monterey Bay", slug: "csumb" },
  { name: "Cal State Channel Islands", slug: "csuci" },
  { name: "Cal State Pomona", slug: "csupomona" },
  { name: "Cal State San Luis Obispo", slug: "calpoly" },
  // Private Universities
  { name: "Stanford", slug: "stanford" },
  { name: "USC", slug: "usc" },
  { name: "Santa Clara", slug: "santaclara" },
  { name: "Loyola Marymount", slug: "lmu" },
  { name: "University of San Diego", slug: "usd" },
  { name: "University of San Francisco", slug: "usfca" },
  { name: "Azusa Pacific", slug: "apu" },
  { name: "Chapman", slug: "chapman" },
  { name: "Claremont McKenna", slug: "cmc" },
  { name: "Harvey Mudd", slug: "hmc" },
  { name: "Pitzer", slug: "pitzer" },
  { name: "Scripps College", slug: "scripps" },
  { name: "Art Center", slug: "artcenter" },
  { name: "CalArts", slug: "calarts" },
];

const categories = [
  { name: "Textbooks", icon: "📚", slug: "textbooks" },
  { name: "Electronics", icon: "💻", slug: "electronics" },
  { name: "Furniture", icon: "🪑", slug: "furniture" },
  { name: "Clothing", icon: "👕", slug: "clothing" },
  { name: "Transportation", icon: "🚗", slug: "transportation" },
  { name: "Appliances", icon: "🔌", slug: "appliances" },
];

const featuredProducts = [
  {
    id: 1,
    title: "Calculus Textbook - Like New",
    price: "$45",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=200&fit=crop",
    campus: "UCLA",
  },
  {
    id: 2,
    title: "Mini Refrigerator",
    price: "$60",
    image: "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=300&h=200&fit=crop",
    campus: "UC Berkeley",
  },
  {
    id: 3,
    title: "Mountain Bike - Great Condition",
    price: "$150",
    image: "https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=300&h=200&fit=crop",
    campus: "UC Davis",
  },
  {
    id: 4,
    title: "MacBook Pro Charger",
    price: "$35",
    image: "https://images.unsplash.com/photo-1564466969055-72839e07976c?w=300&h=200&fit=crop",
    campus: "UC Irvine",
  },
];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-l from-blue-600 to-red-700 py-16 px-8 text-white">
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">
            Buy & Sell Across All California Campuses
          </h1>
          <p className="mb-8 text-lg text-blue-100">
            The trusted marketplace for UC students. Find textbooks, furniture,
            electronics, and more from students at your campus and beyond.
          </p>
          
          {/* Search Bar */}
          <div className="mx-auto flex max-w-xl overflow-hidden rounded-lg bg-white shadow-lg">
            <input
              type="text"
              placeholder="Search for products..."
              className="flex-1 px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Link
              to={`/campuses/ucla/products?search=${searchQuery}`}
              className="bg-indigo-600 px-6 py-3 font-medium text-white transition hover:bg-indigo-700"
            >
              Search
            </Link>
          </div>
          
          {/* Quick Sell Button */}
          <div className="mt-6 flex justify-center gap-4">
            <Link
              to="/products/upload"
              className="flex items-center gap-2 rounded-lg bg-white/20 px-6 py-3 font-medium text-white backdrop-blur-sm transition hover:bg-white/30"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              List an Item
            </Link>
          </div>
        </div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg
            className="h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <defs>
              <pattern
                id="grid"
                width="10"
                height="10"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 10 0 L 0 0 0 10"
                  fill="none"
                  stroke="white"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { value: "45+", label: "Campuses" },
          { value: "500K+", label: "Students" },
          { value: "100K+", label: "Products Listed" },
          { value: "95%", label: "Success Rate" },
        ].map((stat, index) => (
          <div
            key={index}
            className="rounded-xl bg-white p-6 text-center shadow-md"
          >
            <div className="text-3xl font-bold text-blue-600">{stat.value}</div>
            <div className="mt-1 text-sm text-gray-600">{stat.label}</div>
          </div>
        ))}
      </section>

      {/* Categories Section */}
      <section>
        <h2 className="mb-6 text-2xl font-bold text-gray-900">
          Browse Categories
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
          {categories.map((category) => (
            <Link
              key={category.slug}
              to={`/campuses/ucla/products?category=${category.slug}`}
              className="group flex flex-col items-center rounded-xl bg-white p-6 shadow-md transition hover:-translate-y-1 hover:shadow-lg"
            >
              <span className="mb-3 text-4xl">{category.icon}</span>
              <span className="font-medium text-gray-700 group-hover:text-blue-600">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Campus Quick Links */}
      <section>
        <h2 className="mb-6 text-2xl font-bold text-gray-900">
          Select Your Campus
        </h2>
        <div className="flex flex-wrap gap-3">
          {campuses.map((campus) => (
            <Link
              key={campus.slug}
              to={`/campuses/${campus.slug}/products`}
              className="rounded-full border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 transition hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600"
            >
              {campus.name}
            </Link>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="rounded-2xl bg-gray-100 py-12">
        <h2 className="mb-8 text-center text-2xl font-bold text-gray-900">
          How It Works
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              step: "1",
              title: "List Your Item",
              description:
                "Take a photo, add a description and price, and post in seconds.",
            },
            {
              step: "2",
              title: "Connect & Chat",
              description:
                "Buyers reach out through our secure messaging system.",
            },
            {
              step: "3",
              title: "Make the Deal",
              description:
                "Meet on campus and exchange. Cash or digital payment.",
            },
          ].map((item, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white">
                {item.step}
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                {item.title}
              </h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Featured Listings</h2>
          <Link
            to="/campuses/ucla/products"
            className="text-blue-600 hover:underline"
          >
            View All →
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
          {featuredProducts.map((product) => (
            <Link
              key={product.id}
              to={`/campuses/ucla/products/${product.id}`}
              className="group overflow-hidden rounded-xl bg-white shadow-md transition hover:shadow-lg"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.title}
                  className="h-full w-full object-cover transition group-hover:scale-105"
                />
                <span className="absolute bottom-2 left-2 rounded-full bg-white/90 px-2 py-1 text-xs font-medium text-gray-700">
                  {product.campus}
                </span>
              </div>
              <div className="p-4">
                <h3 className="mb-1 font-medium text-gray-900 line-clamp-1 group-hover:text-blue-600">
                  {product.title}
                </h3>
                <p className="text-lg font-bold text-blue-600">{product.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="rounded-2xl bg-gradient-to-r from-green-500 to-teal-600 py-12 px-8 text-center text-white">
        <h2 className="mb-4 text-2xl font-bold">Ready to Sell?</h2>
        <p className="mb-6 text-green-100">
          Turn your unused items into cash. List now and connect with buyers
          across California campuses.
        </p>
        <Link
          to="/user/signup"
          className="inline-block rounded-lg bg-white px-8 py-3 font-semibold text-green-600 transition hover:bg-gray-100"
        >
          Start Selling Today
        </Link>
      </section>
    </div>
  );
}
