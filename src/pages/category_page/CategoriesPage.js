import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./CategoriesPage.css";

// Reusable Category Card component
const CategoryCard = ({ category, onClick }) => (
  <motion.div
    className="category-card"
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.97 }}
    onClick={onClick}
  >
    <img src={category.image} alt={category.name} className="category-image" />
    <div className="category-overlay">
      <h2 className="category-name">{category.name}</h2>
      <p className="category-count">{category.product_count} products</p>
    </div>
  </motion.div>
);

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(
          "https://krstoreapi.phalla.lol/api/products/kr"
        );
        const products = await res.json();

        const categoryRules = [
          {
            name: "Camera Phone",
            brands: ["Apple", "Samsung", "Howie"],
            image: "/images/image.png",
          },
          {
            name: "Android",
            brands: ["Vivo", "Oppo", "Horner"],
            image: "/images/android.png",
          },
          {
            name: "Gaming Phone",
            brands: ["Asus"],
            image: "/images/gamming.png",
          },
          {
            name: "Flagship Phones",
            brands: ["Apple"],
            image: "/images/flagship-phone.png",
          },
          {
            name: "Foldable Phones",
            brands: ["Samsung"],
            image: "/images/Foldable Phones.png",
          },
          {
            name: "Budget Phones",
            brands: ["Vivo", "Oppo", "Horner"],
            image: "/images/Budget-Phones.png",
          },
        ];

        const categoriesData = categoryRules.map((cat, idx) => {
          const categoryProducts = products.filter((p) =>
            cat.brands.includes(p.brand)
          );
          return {
            id: idx + 1,
            ...cat,
            product_count: categoryProducts.length,
            products: categoryProducts,
          };
        });

        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) return <p className="loading">Loading categories...</p>;
  if (!categories.length)
    return <p className="loading">No categories available.</p>;

  return (
    <div className="categories-page">
      <section className="categories">
        <h2 className="section-title">Browse Categories</h2>
        <div className="categories-grid">
          {categories.map((cat) => (
            <CategoryCard
              key={cat.id}
              category={cat}
              onClick={() =>
                navigate("/products", {
                  state: { category: cat.name, products: cat.products },
                })
              }
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default CategoriesPage;
