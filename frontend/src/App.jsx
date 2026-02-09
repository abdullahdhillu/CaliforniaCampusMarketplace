import { Navigate, Route, Routes } from "react-router-dom";
import BrowseProducts from "./pages/BrowseProducts.jsx";
import Layout from './pages/Layout.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/campuses/ucla/products" replace />} />
        <Route path="/campuses/:slug/products" element={<BrowseProducts />} />
        <Route path="*" element={<div className="p-6">Not found</div>} />
      </Route>
    </Routes>
  );
}
