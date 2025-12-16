import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ProductGrid.css";

const ProductGrid = ({ products }) => {
  const navigate = useNavigate();
  const [ratings, setRatings] = useState({}); // State to store ratings for all products
  const [message, setMessage] = useState(""); // State for feedback message

  // Load ratings from localStorage on mount
  useEffect(() => {
    const savedRatings = {};
    products.forEach((product) => {
      const savedRating = localStorage.getItem(`productRating_${product.id}`);
      if (savedRating) {
        savedRatings[product.id] = parseInt(savedRating, 10);
      }
    });
    setRatings(savedRatings);
  }, [products]);

  // Function to handle star rating clicks
  const handleStarClick = (productId, rating) => {
    setRatings((prev) => ({
      ...prev,
      [productId]: rating,
    }));
    // Save rating to localStorage
    localStorage.setItem(`productRating_${productId}`, rating);
    setMessage(`Rated ${rating} star${rating !== 1 ? "s" : ""}!`);
    setTimeout(() => setMessage(""), 2000);
  };

  // Function to render star ratings
  const renderStars = (productId) => {
    const maxStars = 5;
    const rating = ratings[productId] || 0; // Use local rating or 0 if not set
    return (
      <div className="product-rating">
        {[...Array(maxStars)].map((_, index) => {
          const starValue = index + 1;
          return (
            <span
              key={index}
              style={{
                color: starValue <= rating ? "#FFD700" : "#ccc",
                cursor: "pointer",
                fontSize: "14px",
              }}
              onClick={(e) => {
                e.stopPropagation(); // Prevent card click from navigating
                handleStarClick(productId, starValue);
              }}
            >
              <h2>☆</h2>
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div className="products-grid">
      {message && <div className="toast-message">{message}</div>}
      {products.map((product, index) => (
        <div className="product-card" key={`${product.id}-${index}`}>
          {product.badge && (
            <span className="product-badge">{product.badge}</span>
          )}
          <div className="product-image">
            <img
              src={product.image}
              alt={product.name}
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/products")}
            />
          </div>
          <div className="product-info">
            <h3 className="product-name">{product.name}</h3>
            <p className="product-description">{product.description}</p>
            <p className="product-price">${product.price}</p>
            <div className="product-rating-container">
              {renderStars(product.id)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
