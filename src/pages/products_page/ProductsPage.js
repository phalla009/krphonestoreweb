import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ProductCard from "../../components/ProductCard";
import "./ProductsPage.css";

const ProductsPage = ({ products = [], addToCart, user, onRequireSignIn }) => {
  const [ratings, setRatings] = useState({});
  const [toast, setToast] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const savedRatings = {};
    products.forEach((product) => {
      const saved = localStorage.getItem(`productRating_${product.id}`);
      if (saved) savedRatings[product.id] = parseInt(saved, 10);
    });
    setRatings(savedRatings);
  }, [products]);

  const handleStarClick = (productId, rating) => {
    setRatings((prev) => ({ ...prev, [productId]: rating }));
    localStorage.setItem(`productRating_${productId}`, rating);
    showToast(`Rated ${rating} ☆`);
  };

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(""), 2000);
  };

  const handleAddToCart = (product) => {
    if (!user) {
      onRequireSignIn();
      return;
    }
    addToCart(product);
    showToast(`${product.name} added to cart!`);
  };

  return (
    <div className="products-page">
      {toast && <div className="toast-message">{toast}</div>}

      <h2 className="section-title">Products</h2>
      <div className="products-grid">
        <AnimatePresence>
          {products.length === 0 ? (
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
                No products available in this brand.
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
                Shop
              </motion.button>
            </motion.div>
          ) : (
            products.map((product) => (
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
