import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { AnimatePresence } from "framer-motion";
import { useUser, useClerk } from "@clerk/clerk-react";

import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/home_page/HomePage";
import ProductsPage from "./pages/products_page/ProductsPage";
import ProductDetailPage from "./pages/products_detail_page/ProductDetailPage";
import CartPage from "./pages/card_page/CartPage";
import CategoriesPage from "./pages/category_page/CategoriesPage";
import BrandsPage from "./pages/brands_page/BrandsPage";
import AuthModals from "./components/AuthModals";
import AboutPage from "./pages/about_page/AboutPage";

import api from "./api";
import "./App.css";

function App() {
  const { user, isSignedIn } = useUser();
  const { signOut } = useClerk();

  const [cartItems, setCartItems] = useState(
    JSON.parse(localStorage.getItem("cart") || "[]")
  );
  const [showAuthModal, setShowAuthModal] = useState(null);
  const [toast, setToast] = useState("");
  const [products, setProducts] = useState([]);

  // 🛒 Save cart
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // 📦 Fetch products
  useEffect(() => {
    fetchProducts();
  }, []);

  // Close auth modal once Clerk reports the user is signed in (after sign-in/up)
  useEffect(() => {
    if (isSignedIn) {
      setShowAuthModal(null);
    }
  }, [isSignedIn]);

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

  // 🔔 Toast
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  };

  // 🛒 Add to Cart
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
      return [...prev, { ...product, quantity: 1 }];
    });
    showToast(`${product.name} added to cart!`);
  };

  const removeFromCart = (productId) =>
    setCartItems((prev) => prev.filter((item) => item.id !== productId));

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // 🧾 Place order
  const handleOrder = (items, total, customer) => {
    if (!items.length) return;
    showToast(
      `Order placed! Total: $${total.toFixed(2)} | Customer: ${customer.name}`
    );
    setCartItems([]);
  };

  // 🔐 Clerk callbacks
  // Modal will close automatically when user signs in/up (handled in AuthModals)
  const handleLogout = async () => {
    await signOut();
  };

  return (
    <Router>
      <div className="container">
        {toast && <div className="toast-message">{toast}</div>}

        <Header
          user={isSignedIn ? user : null}
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
                  user={isSignedIn ? user : null}
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
                  user={isSignedIn ? user : null}
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
                  user={isSignedIn ? user : null}
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
                  user={isSignedIn ? user : null}
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
                  user={isSignedIn ? user : null}
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
          onSwitch={(modal) => setShowAuthModal(modal)}
        />
      </div>
    </Router>
  );
}

export default App;
