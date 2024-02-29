import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import ProductPage from "./pages/ProductPage";
import CategoryPage from "./pages/CategoryPage";
import TransactionPage from "./pages/TransactionPage";

function App() {
  return (
    <Router>
      <div style={{ display: "flex" }}>
        <Sidebar />
        <div style={{ flexGrow: 1, padding: "20px", marginTop: "20px" }}>
          <Routes>
            <Route path="/categories" element={<CategoryPage />} />
            <Route path="/products" element={<ProductPage />} />
            <Route path="/transactions" element={<TransactionPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
