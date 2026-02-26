/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext(null);
 
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem("token"));

    // Listen for localStorage changes (from other tabs)
    useEffect(() => {
        function handleStorageChange(e) {
            if (e.key === "token") {
                setToken(e.newValue);
            }
        }
        
        window.addEventListener("storage", handleStorageChange);
        
        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    function loginWithToken(newToken) {
        localStorage.setItem("token" , newToken);
        setToken(newToken);
    }

    function logout() {
        localStorage.removeItem("token");
        setToken(null);
    }

    const value = {
        token, 
         isAuthenticated: !!token,
        loginWithToken,
        logout
    }
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
