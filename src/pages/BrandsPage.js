import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "./BrandsPage.css";

const BrandsPage = ({ cartItems = [], addToCart, user, onRequireSignIn }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [message, setMessage] = useState("");
  const [ratings, setRatings] = useState({}); // store local user ratings
  const navigate = useNavigate();

  // Load saved ratings from localStorage on mount
  useEffect(() => {
    const savedRatings = {};
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("productRating_")) {
        const productId = key.split("_")[1];
        savedRatings[productId] = parseInt(localStorage.getItem(key), 10);
      }
    });
    setRatings(savedRatings);
  }, []);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/category/kr");
        const data = res.data;
        setCategories(data);
        if (data.length > 0) setSelectedCategory(data[0].name);
      } catch (err) {
        console.error(err);
        setMessage("Failed to load brands.");
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // Fetch all products
  useEffect(() => {
    const fetchAllProducts = async () => {
      setLoadingProducts(true);
      try {
        const res = await api.get("/products/kr");
        setAllProducts(res.data);
      } catch (err) {
        console.error(err);
        setMessage("Failed to load products.");
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchAllProducts();
  }, []);

  // Filter products by selected category
  useEffect(() => {
    if (!selectedCategory || !allProducts.length) return;
    setProducts(
      allProducts.filter(
        (p) => p.category?.toLowerCase() === selectedCategory.toLowerCase()
      )
    );
  }, [selectedCategory, allProducts]);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 2000);
  };

  // Handle rating
  const handleRate = (productId, value) => {
    setRatings((prev) => {
      const updated = { ...prev, [productId]: value };
      localStorage.setItem(`productRating_${productId}`, value); // save to localStorage
      return updated;
    });
    showMessage(`Rated ${value} ☆`);
  };

  if (loadingCategories) return <p className="loading">Loading brands...</p>;
  if (!categories.length) return <p className="loading">No brand available.</p>;

  return (
    <div id="brands-page">
      {/* Brand Section */}
      <section>
        <h2 className="section-title">Browse Brands</h2>
        <div className="brands-grid">
          {categories.map((category) => (
            <motion.div
              key={category.id}
              className={`brand-card ${
                selectedCategory === category.name ? "active" : ""
              }`}
              onClick={() => setSelectedCategory(category.name)}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="category-overlay">
                <div className="category-name">{category.name}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Toast */}
      {message && <div className="toast-message">{message}</div>}

      {/* Products Section */}
      <h2 className="section-title" style={{ marginTop: "40px" }}>
        {`Products in ${selectedCategory || ""}`}
      </h2>

      {loadingProducts ? (
        <p className="loading">Loading products...</p>
      ) : (
        <motion.div layout className="products-grid">
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
                            onClick={() => handleRate(product.id, ratingValue)}
                          >
                            <h2>☆</h2>
                          </span>
                        );
                      })}
                    </div>

                    {/* Add to Cart */}
                    <motion.button
                      onClick={() => {
                        if (!user) {
                          // Show sign-in modal if not logged in
                          onRequireSignIn();
                          return;
                        }
                        addToCart(product);
                        showMessage(`${product.name} added to cart!`);
                      }}
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
        </motion.div>
      )}
    </div>
  );
};

export default BrandsPage;
