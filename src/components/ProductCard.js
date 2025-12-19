import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product, rating, onRate, onAddToCart }) => {
  const navigate = useNavigate();

  return (
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
        onClick={() => navigate(`/product/${product.id}`)}
      >
        {product.images?.length > 0 ? (
          <img src={product.images[0]} alt={product.name} />
        ) : (
          <p>No image</p>
        )}
        <span className={`stock-badge ${product.stock > 0 ? "in" : "out"}`}>
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
            return (
              <span
                key={i}
                className={`star ${ratingValue <= rating ? "filled" : ""}`}
                onClick={() => onRate(product.id, ratingValue)}
              >
                <h2>☆</h2>
              </span>
            );
          })}
        </div>

        {/* Add to Cart */}
        <motion.button
          onClick={() => onAddToCart(product)}
          disabled={product.stock === 0}
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: product.stock === 0 ? 1 : 1.05 }}
          className="add-to-cart-btn"
        >
          {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
