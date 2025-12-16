import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
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
      onRequireSignIn(); // ✅ Show sign-in modal if not logged in
      return;
    }
    addToCart(product);
    showToast(`${product.name} added to cart!`);
  };

  const renderStars = (productId) => {
    const maxStars = 5;
    const rating = ratings[productId] || 0;
    return (
      <div className="product-rating">
        {[...Array(maxStars)].map((_, i) => (
          <span
            key={i}
            className={i + 1 <= rating ? "star-filled" : "star-empty"}
            onClick={() => handleStarClick(productId, i + 1)}
          >
            <h2>☆</h2>
          </span>
        ))}
      </div>
    );
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
              <motion.div
                key={product.id}
                className="product-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.3 }}
                style={{ cursor: "pointer" }}
              >
                {/* Product Image */}
                <motion.div
                  className="product-image"
                  whileHover={{ scale: 1.05 }}
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/product/${product.id}`)} // ✅ Navigate to product detail
                >
                  {product.images?.length > 0 ? (
                    <img src={product.images[0]} alt={product.name} />
                  ) : (
                    <p>No image</p>
                  )}
                  <span
                    className={`stock-badge ${
                      product.stock > 0 ? "in" : "out"
                    }`}
                  >
                    {product.stock > 0 ? "In Stock" : "Out of Stock"}
                  </span>
                </motion.div>

                {/* Product Info */}
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <div className="product-price">${product.price}</div>

                  {/* ⭐ Rating */}
                  <div className="product-rating">
                    {[...Array(5)].map((_, i) => {
                      const ratingValue = i + 1;
                      const currentRating = ratings[product.id] || 0;
                      return (
                        <span
                          key={i}
                          className={`star ${
                            ratingValue <= currentRating ? "filled" : ""
                          }`}
                          onClick={() =>
                            handleStarClick(product.id, ratingValue)
                          }
                        >
                          <h2>☆</h2>
                        </span>
                      );
                    })}
                  </div>

                  {/* Add to Cart */}
                  <motion.button
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock === 0}
                    whileTap={{ scale: 0.9 }}
                    whileHover={{ scale: product.stock === 0 ? 1 : 1.05 }}
                    className="add-to-cart-btn"
                  >
                    {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                  </motion.button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProductsPage;
