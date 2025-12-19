import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/home_page/HomePage";
import ProductsPage from "./pages/products_page/ProductsPage";
import ProductDetailPage from "./pages/products_detail_page/ProductDetailPage";
import CartPage from "./pages/card_page/CartPage";
import CategoriesPage from "./pages/category_page/CategoriesPage";
import BrandsPage from "./pages/brands_page/BrandsPage";
import AuthModals from "./components/AuthModals";

import api from "./api";
import "./App.css";

function App() {
  const [cartItems, setCartItems] = useState(
    JSON.parse(localStorage.getItem("cart") || "[]")
  );
  const [showAuthModal, setShowAuthModal] = useState(null);
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState("");
  const [products, setProducts] = useState([]);

  // ✅ Load user from localStorage (stay logged in after refresh)
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  // ✅ Save cart to localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // ✅ Fetch products
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products/kr");
      setProducts(
        res.data.map((p) => ({
          ...p,
          images: p.images?.map((img) => `${img}`) || [],
        }))
      );
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  // ✅ Toast
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  };

  // ✅ Add to Cart (with stock check)
  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        if (existing.quantity < product.stock) {
          return prev.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          showToast(`Cannot add more than stock for ${product.name}`);
          return prev;
        }
      }
      return [
        ...prev,
        { ...product, quantity: 1, stock: product.stock || Infinity },
      ];
    });
    showToast(`${product.name} added to cart!`);
  };

  // ✅ Remove item
  const removeFromCart = (productId) =>
    setCartItems((prev) => prev.filter((item) => item.id !== productId));

  // ✅ Update quantity
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId
          ? { ...item, quantity: Math.min(newQuantity, item.stock || Infinity) }
          : item
      )
    );
  };

  // ✅ Place order
  const handleOrder = (items, total, customer, paymentMethod) => {
    if (!items.length) return;
    showToast(
      `Order placed! Total: $${total.toFixed(2)} | Customer: ${customer.name}`
    );
    setCartItems([]);
  };

  // ✅ Auth
  const handleLogin = (userData) => {
    setUser(userData);
    setShowAuthModal(null);
  };

  const handleLogout = () => setUser(null);

  return (
    <Router>
      <div className="container">
        {toast && <div className="toast-message">{toast}</div>}

        <Header
          user={user}
          onLoginClick={() => setShowAuthModal("signin")}
          onLogout={handleLogout}
          cartCount={cartItems.reduce(
            (total, item) => total + item.quantity,
            0
          )}
        />

        <AnimatePresence mode="wait">
          <Routes>
            <Route
              path="/"
              element={
                <HomePage
                  addToCart={addToCart}
                  products={products}
                  user={user}
                  onRequireSignIn={() => setShowAuthModal("signin")}
                />
              }
            />
            <Route
              path="/products"
              element={
                <ProductsPage
                  addToCart={addToCart}
                  products={products}
                  user={user}
                  onRequireSignIn={() => setShowAuthModal("signin")}
                />
              }
            />
            <Route
              path="/categories"
              element={
                <CategoriesPage
                  addToCart={addToCart}
                  products={products}
                  user={user}
                  onRequireSignIn={() => setShowAuthModal("signin")}
                />
              }
            />
            <Route
              path="/brands"
              element={
                <BrandsPage
                  cartItems={cartItems}
                  addToCart={addToCart}
                  user={user}
                  onRequireSignIn={() => setShowAuthModal("signin")}
                />
              }
            />
            <Route
              path="/cart"
              element={
                <CartPage
                  cartItems={cartItems}
                  removeFromCart={removeFromCart}
                  updateQuantity={updateQuantity}
                  onOrder={handleOrder}
                />
              }
            />
            <Route
              path="/product/:id"
              element={
                <ProductDetailPage
                  addToCart={addToCart}
                  user={user}
                  onRequireSignIn={() => setShowAuthModal("signin")}
                />
              }
            />
          </Routes>
        </AnimatePresence>

        <Footer />

        <AuthModals
          showModal={showAuthModal}
          onClose={() => setShowAuthModal(null)}
          onLogin={handleLogin}
          onSignup={handleLogin}
          onSwitch={(modal) => setShowAuthModal(modal)}
        />
      </div>
    </Router>
  );
}

export default App;
