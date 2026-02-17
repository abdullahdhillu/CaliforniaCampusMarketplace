import { Route, Routes } from "react-router-dom";
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
        <Route path="/home" element={<HomePage />}/>
        <Route path="/campuses/:slug/products" element={<BrowseProducts />} />
        <Route path="/campuses/:slug/products/:id" element={<ProductDetails />} />
        <Route path="/products/upload" element={<CreateListing />} />
        <Route path="/user/login" element={<Login />} />
        <Route path="/user/signup" element={<Signup />} />
        <Route path="*" element={<div className="p-6">Not found</div>} />
      </Route>
    </Routes>
  );
}
