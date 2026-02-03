import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Auth from "./pages/Auth";
import Products from "./pages/Products";
import ProductPage from "./pages/ProductPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Offers from "./pages/Offers";
import Orders from "./pages/Order";
import Footer from "./pages/Footer";
import CategoryBar from "./components/CategoryBar";
import Header from "./components/Header";
import HomeCarousel from "./components/HomeCarousel";
import React from "react";
import OfferProducts from "./pages/OfferProducts";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [selectedCategory, setSelectedCategory] = useState("all");

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("token");
  };

  const ProtectedRoute = ({ children }) => {
    if (!token) return <Navigate to="/auth" />;
    return children;
  };

  return (
    <>
      <Routes>
        {/* AUTH */}
        <Route
          path="/auth"
          element={
            token ? (
              <Navigate to="/products" />
            ) : (
              <Auth onLogin={() => setToken(localStorage.getItem("token"))} />
            )
          }
        />

        {/* FORGOT / RESET */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* PRODUCTS */}
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <>
                <Header onLogout={handleLogout} />
                <CategoryBar
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                />
                <HomeCarousel selectedCategory={selectedCategory} />
                <Products selectedCategory={selectedCategory} />
                <Footer />
              </>
            </ProtectedRoute>
          }
        />

        {/* PRODUCT DETAIL */}
        <Route
          path="/product/:slug/:id"
          element={
            <ProtectedRoute>
              <>
                <Header onLogout={handleLogout} />
                <ProductPage />
                <Footer />
              </>
            </ProtectedRoute>
          }
        />

        {/* ✅ CART PAGE (YAHI FIX HAI) */}
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <>
                <Header onLogout={handleLogout} />
                <Cart />
                <Footer />
              </>
            </ProtectedRoute>
          }
        />

        {/* ORDERS */}
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <>
                <Header onLogout={handleLogout} />
                <Orders />
                <Footer />
              </>
            </ProtectedRoute>
          }
        />

        {/* WISHLIST */}
        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <>
                <Header onLogout={handleLogout} />
                <Wishlist />
                <Footer />
              </>
            </ProtectedRoute>
          }
        />

        {/* OFFERS */}
        <Route
          path="/offers"
          element={
            <ProtectedRoute>
              <>
                <Header onLogout={handleLogout} />
                <Offers />
                <Footer />
              </>
            </ProtectedRoute>
          }
        />

        {/* FALLBACK */}
        <Route
          path="*"
          element={<Navigate to={token ? "/products" : "/auth"} />}
        />
        <Route
  path="/offer/:offerId"
  element={
    <ProtectedRoute>
      <>
        <Header onLogout={handleLogout} />
        <OfferProducts />
        <Footer />
      </>
    </ProtectedRoute>
  }
/>


      </Routes>
    </>
  );
};

export default App;
