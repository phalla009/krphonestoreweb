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
      <p className="category-count">{category.desc}</p>
      {/* <p className="category-count">{category.product_count} products</p> */}
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
            desc: "A camera phone is a mobile phone that is able to capture photographs and often record video using one or more built-in digital cameras.",
          },
          {
            name: "Android",
            brands: ["Vivo", "Oppo", "Horner"],
            image: "/images/android.png",
            desc: "An Android phone is a high-tech smartphone that runs Google’s Android operating system and is made by various mobile manufacturers.",
          },
          {
            name: "Gaming Phone",
            brands: ["Asus"],
            image: "/images/gamming.png",
            desc: "A gaming phone is a high-performance smartphone built for smooth and immersive gaming.",
          },
          {
            name: "Flagship Phones",
            brands: ["Apple"],
            image: "/images/flagship-phone.png",
            desc: "Flagship phones are premium smartphones that feature top-tier performance, advanced technology, high-quality cameras, and the latest designs from a brand.",
          },
          {
            name: "Foldable Phones",
            brands: ["Samsung"],
            image: "/images/Foldable Phones.png",
            desc: "Foldable phones are innovative smartphones with flexible screens that can fold, offering a larger display in a compact design.",
          },
          {
            name: "Budget Phones",
            brands: ["Vivo", "Oppo", "Horner"],
            image: "/images/Budget-Phones.png",
            desc: "Budget phones are affordable smartphones that offer essential features and reliable performance at a low cost.",
          },
          {
            name: "Accessories",
            brands: ["Apple", "Oppo", "Horner"],
            image: "/images/accesseries.png",
            desc: "Accessories are additional products like chargers, headphones, cases, and cables that enhance and protect smartphones.",
          },
          {
            name: "iPads",
            brands: ["Apple", "Howie", "Sammsung"],
            image: "/images/ipad.png",
            desc: "iPads are tablet devices by Apple that offer a large touchscreen, powerful performance, and support for work, study, and entertainment.",
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
