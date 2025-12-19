import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ProductCard from "../../components/ProductCard";

const sliderImages = [
  "/images/slider_1.jpg",
  "/images/slider_2.jpg",
  "/images/slider_3.jpg",
];

const HomePage = ({ addToCart, productLimit = 4 }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [ratings, setRatings] = useState({});
  const [toast, setToast] = useState("");
  const navigate = useNavigate();

  // Auto-change slide every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          `https://krstoreapi.phalla.lol/api/products/kr?limit=${productLimit}`
        );
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();

        const mappedProducts = data.slice(0, productLimit).map((p) => ({
          ...p,
          images:
            p.images && p.images.length ? p.images : ["/images/default.png"],
        }));

        setProducts(mappedProducts);

        // Load saved ratings
        const savedRatings = {};
        mappedProducts.forEach((p) => {
          const saved = localStorage.getItem(`productRating_${p.id}`);
          if (saved) savedRatings[p.id] = parseInt(saved, 10);
        });
        setRatings(savedRatings);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [productLimit]);

  // Rating handler
  const handleRate = (productId, rating) => {
    setRatings((prev) => ({ ...prev, [productId]: rating }));
    localStorage.setItem(`productRating_${productId}`, rating);
    showToast(`Rated ${rating} ☆`);
  };

  // Show toast message
  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(""), 2000);
  };

  // Slider navigation
  const prevSlide = () =>
    setCurrentSlide(
      currentSlide === 0 ? sliderImages.length - 1 : currentSlide - 1
    );
  const nextSlide = () =>
    setCurrentSlide((currentSlide + 1) % sliderImages.length);

  return (
    <div className="page active" id="home-page">
      {/* Toast */}
      {toast && <div className="toast-message">{toast}</div>}

      {/* Hero Section */}
      <motion.section
        className="hero"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <div className="hero-content">
          <motion.h1
            className="hero-title"
            animate={{ x: ["100%", "-100%"] }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          >
            Experience the Future of Mobile Technology
          </motion.h1>
          <motion.p
            className="hero-subtitle"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            transition={{
              duration: 5,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          >
            Discover our latest collection of premium smartphones with
            cutting-edge features, stunning displays, and powerful performance.
          </motion.p>
        </div>

        {/* Hero Phone */}
        <motion.div
          className="hero-image"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, type: "spring", stiffness: 120 }}
        >
          <motion.div
            className="glow-effect"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0.5, 0.8, 0.5, 0],
              scale: [1, 1.1, 1.2, 1.1, 1],
            }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          ></motion.div>

          <motion.div
            className="phone-display"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: [0, -10, 0], opacity: 1 }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          >
            <img src="/images/iphone16promax.png" alt="Premium Smartphone" />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Slider */}
      <section className="slider">
        <div
          className="slider-wrapper"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {sliderImages.map((img, index) => (
            <div
              key={index}
              style={{ minWidth: "100%", cursor: "pointer" }}
              onClick={() => navigate("/products")}
            >
              <img
                src={img}
                alt={`Slide ${index + 1}`}
                className="slider-image"
              />
            </div>
          ))}
        </div>

        <div className="slider-dots">
          {sliderImages.map((_, index) => (
            <span
              key={index}
              className={`dot ${index === currentSlide ? "active" : ""}`}
              onClick={() => setCurrentSlide(index)}
            ></span>
          ))}
        </div>

        <button className="arrow left" onClick={prevSlide}>
          &#10094;
        </button>
        <button className="arrow right" onClick={nextSlide}>
          &#10095;
        </button>
      </section>

      {/* Latest Products */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h2 className="section-title">Latest Products</h2>
        {loading ? (
          <p>Loading products...</p>
        ) : (
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                rating={ratings[product.id] || 0}
                onRate={handleRate}
                onAddToCart={(p) => {
                  addToCart(p);
                  showToast(`${p.name} added to cart!`);
                }}
              />
            ))}
          </div>
        )}
      </motion.section>

      {/* Slider CSS */}
      <style jsx>{`
        .slider {
          position: relative;
          width: 100%;
          max-width: 1200px;
          margin: 40px auto;
          overflow: hidden;
          border-radius: 15px;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
        }
        .slider-wrapper {
          display: flex;
          transition: transform 0.8s ease-in-out;
        }
        .slider-image {
          min-width: 100%;
          height: 400px;
          object-fit: cover;
        }
        .slider-dots {
          position: absolute;
          bottom: 15px;
          width: 100%;
          display: flex;
          justify-content: center;
          gap: 10px;
        }
        .dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.5);
          cursor: pointer;
          transition: all 0.3s;
        }
        .dot.active {
          background: #fff;
          transform: scale(1.2);
        }
        .arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(0, 0, 0, 0.4);
          border: none;
          color: #fff;
          font-size: 30px;
          padding: 8px 12px;
          cursor: pointer;
          border-radius: 50%;
          z-index: 10;
          transition: background 0.3s;
        }
        .arrow:hover {
          background: rgba(0, 0, 0, 0.7);
        }
        .arrow.left {
          left: 15px;
        }
        .arrow.right {
          right: 15px;
        }
        @media (max-width: 768px) {
          .slider-image {
            height: 250px;
          }
        }
        .toast-message {
          position: fixed;
          top: 20px;
          right: 20px;
          background: #1b1b1b;
          color: #fff;
          padding: 10px 20px;
          border-radius: 8px;
          z-index: 1000;
        }
      `}</style>
    </div>
  );
};

export default HomePage;
