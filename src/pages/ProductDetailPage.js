import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import "./ProductDetailPage.css";

const ProductDetailPage = ({ addToCart }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [toast, setToast] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/kr/${id}`);
        const p = res.data;
        const images = p.images?.map((img) => `${img}`) || [];
        setProduct({ ...p, images });
        setMainImage(images[0] || "/images/default.png");
      } catch (err) {
        console.error(err);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = (product) => {
    addToCart(product);
    setToast(`${product.name} added to cart!`);
    setTimeout(() => setToast(""), 2000);
  };

  if (!product) return <p className="loading">Loading...</p>;

  return (
    <div className="product-detail-page">
      {toast && <div className="toast-message">{toast}</div>}

      <div className="product-container">
        <div className="product-images">
          <img src={mainImage} alt={product.name} className="main-image" />
          <div className="thumbnails">
            {product.images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`${product.name} ${index}`}
                className={img === mainImage ? "active" : ""}
                onClick={() => setMainImage(img)}
              />
            ))}
          </div>
        </div>

        <div className="product-info">
          <h2 className="product-title">{product.name}</h2>
          <p className="product-description">{product.description}</p>
          <p className="product-price">${product.price}</p>
          <p
            className="product-stock"
            style={{ color: product.stock > 0 ? "green" : "red" }}
          >
            {product.stock > 0 ? "In Stock" : "Out of Stock"}
          </p>
          <button
            className="add-to-cart-btn"
            disabled={product.stock === 0}
            onClick={() => handleAddToCart(product)}
          >
            {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
