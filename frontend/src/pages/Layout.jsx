import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
const primary = "rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700";
const secondary = "rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600"
export default function Layout() {
  const navigate = useNavigate();
  const {isAuthenticated, logout} = useAuth();
  function handleLogout() {
    logout();
    navigate("/home", { replace: true, state: { loggedOut: true } });
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between p-4">
          <Link to="/" className="text-xl font-bold text-gray-900">
            🎓 Campus Marketplace
          </Link>
          <nav className="flex items-center gap-2 text-sm">
            {isAuthenticated ? <>
                <Link to="/products/upload" className={secondary}>
                  List an Item
                </Link>
                <button
                type="button"
                  onClick={handleLogout}
                  className={primary}
                >
                  Logout
                </button>
              </> :  
            (<>
            <Link
              className={secondary}
              to="/user/login"
            >
              Login
            </Link>
            <Link
              className={primary}
              to="/user/signup"
            >
              Signup
            </Link> 
            </>)
            }

          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl p-4">
        <Outlet />
      </main>
    </div>
  );
}
