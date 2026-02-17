import { Link, Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between p-4">
          <Link to="/home" className="text-xl font-bold text-gray-900">
            🎓 Campus Marketplace
          </Link>
          <nav className="flex items-center gap-2 text-sm">
            <Link
              className="rounded-lg px-4 py-2 text-gray-700 transition hover:bg-gray-100 hover:text-blue-600"
              to="/campuses/ucla/products"
            >
              Browse
            </Link>
            <Link
              className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600"
              to="/user/login"
            >
              Login
            </Link>
            <Link
              className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
              to="/user/signup"
            >
              Signup
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl p-4">
        <Outlet />
      </main>
    </div>
  );
}
