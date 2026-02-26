import { Navigate, Route, Routes } from "react-router-dom";
import RequireAuth from "./components/RequireAuth.jsx";
import BrowseProducts from "./pages/BrowseProducts.jsx";
import CreateListing from "./pages/CreateListing.jsx";
import HomePage from "./pages/HomePage.jsx";
import Layout from './pages/Layout.jsx';
import Login from "./pages/Login.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import Signup from "./pages/Signup.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/home" replace />}/>
        <Route path="/home" element={<HomePage/>}/>
        <Route path="/campuses/:slug/products" element={<BrowseProducts />} />
        <Route path="/campuses/:slug/products/:id" element={<ProductDetails />} />
        <Route path="/products/upload" element={<RequireAuth>
          <CreateListing />
        </RequireAuth> } />
        <Route path="/user/login" element={<Login />} />
        <Route path="/user/signup" element={<Signup />} />
        <Route path="*" element={<div className="p-6">Not found</div>} />
      </Route>
    </Routes>
  );
}
