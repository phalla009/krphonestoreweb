import React, { useState } from "react";
import "./ProductCard.css";

const ProductCard = ({ product, addToCart }) => {
  const [currentImage, setCurrentImage] = useState(0);

  // images default to []
  const images = product.images ?? [];

  const nextImage = () => {
    if (images.length > 1) {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }
  };

  return (
    <div className="product-card">
      <div className="product-image" onClick={nextImage}>
        {images.length > 0 ? (
          <img
            src={`http://localhost:8000${images[currentImage]}`}
            alt={product.name}
          />
        ) : (
          <img src="/default-image.png" alt="default" />
        )}
        {product.stock > 0 && <div className="product-badge">In Stock</div>}
      </div>

      <div className="product-info">
        <h3>{product.name}</h3>
        <p>{product.description || ""}</p>
        <div className="product-price">
          <span>${product.price}</span>
          <button
            onClick={() => addToCart(product)}
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
