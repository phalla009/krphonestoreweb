import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ProductCard from "../../components/ProductCard";
import "./ProductsPage.css";

const ProductsPage = ({ products = [], addToCart, user, onRequireSignIn }) => {
  const [ratings, setRatings] = useState({});
  const [toast, setToast] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  // Load saved ratings
  useEffect(() => {
    const savedRatings = {};
    products.forEach((product) => {
      const saved = localStorage.getItem(`productRating_${product.id}`);
      if (saved) savedRatings[product.id] = parseInt(saved, 10);
    });
    setRatings(savedRatings);
  }, [products]);

  // Handle rating
  const handleStarClick = (productId, rating) => {
    setRatings((prev) => ({ ...prev, [productId]: rating }));
    localStorage.setItem(`productRating_${productId}`, rating);
    showToast(`Rated ${rating} ★`);
  };

  // Toast message
  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(""), 2000);
  };

  // Add to cart
  const handleAddToCart = (product) => {
    if (!user) {
      onRequireSignIn();
      return;
    }
    addToCart(product);
    showToast(`${product.name} added to cart!`);
  };

  // 🔍 Search filter (by product name)
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="products-page">
      {toast && <div className="toast-message">{toast}</div>}

      {/* ===== Header ===== */}
      <div className="products-header">
        <h2 className="section-title">Products</h2>

        {/* ===== Search Box ===== */}
        <div className="search-container">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search for products..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="search-button">
              <svg className="search-icon" viewBox="0 0 24 24">
                <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.71.71l.27.28v.79l4.25 4.25a1 1 0 0 0 1.41-1.41L15.5 14zM9.5 14A4.5 4.5 0 1 1 14 9.5 4.51 4.51 0 0 1 9.5 14z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ===== Products Grid ===== */}
      <div className="products-grid">
        <AnimatePresence>
          {filteredProducts.length === 0 ? (
            <motion.div
              key="no-products"
              className="no-products"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                textAlign: "center",
                width: "100%",
                padding: "40px 0",
              }}
            >
              <p style={{ fontSize: "18px", marginBottom: "20px" }}>
                No products found.
              </p>

              <motion.button
                onClick={() => navigate("/products")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: "10px 25px",
                  backgroundColor: "#1b1b1b",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                Shop All
              </motion.button>
            </motion.div>
          ) : (
            filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                rating={ratings[product.id] || 0}
                onRate={handleStarClick}
                onAddToCart={handleAddToCart}
              />
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProductsPage;
