import { Link, Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between p-4">
          <Link to="/" className="font-semibold">
            Campus Marketplace
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link className="hover:underline" to="/campuses/ucla/products">
              Browse
            </Link>
            <Link className="hover:underline" to="/user/login">
              Login
            </Link>
            <Link className="hover:underline" to="/user/signup">
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
