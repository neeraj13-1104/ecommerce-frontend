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

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [selectedCategory, setSelectedCategory] = useState("all");

  // 🔴 CHANGED: cart sidebar state
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("token");
  };

  // 🔐 Protected Route
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
                {/* 🔴 CHANGED */}
                <Header
                  onLogout={handleLogout}
                  onCartOpen={() => setIsCartOpen(true)}
                />

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
                {/* 🔴 CHANGED */}
                <Header
                  onLogout={handleLogout}
                  onCartOpen={() => setIsCartOpen(true)}
                />
                <ProductPage />
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
                {/* 🔴 CHANGED */}
                <Header
                  onLogout={handleLogout}
                  onCartOpen={() => setIsCartOpen(true)}
                />
                <Orders />
                <Footer />
              </>
            </ProtectedRoute>
          }
        />

        {/* ❌ CART ROUTE REMOVED (Option-2) */}

        {/* WISHLIST */}
        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <>
                {/* 🔴 CHANGED */}
                <Header
                  onLogout={handleLogout}
                  onCartOpen={() => setIsCartOpen(true)}
                />
                <Wishlist />
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
                {/* 🔴 CHANGED */}
                <Header
                  onLogout={handleLogout}
                  onCartOpen={() => setIsCartOpen(true)}
                />
                <Offers />
              </>
            </ProtectedRoute>
          }
        />

        {/* FALLBACK */}
        <Route
          path="*"
          element={<Navigate to={token ? "/products" : "/auth"} />}
        />
      </Routes>

      {/* 🔴 CHANGED: Cart sidebar mounted globally */}
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </>
  );
};

export default App;
