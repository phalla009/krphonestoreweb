import React from "react";
import { motion } from "framer-motion";

const AboutPage = () => {
  return (
    <motion.div
      className="about-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <section className="about-hero">
        <h1>About KRSTORE</h1>
        <p>
          KRSTORE is your one-stop e-commerce platform for the latest smartphones and accessories.
          We provide high-quality products with fast delivery and excellent customer service.
        </p>
      </section>

      <section className="about-mission">
        <h2>Our Mission</h2>
        <p>
          Our mission is to bring cutting-edge technology closer to our customers, making shopping
          easy, safe, and enjoyable. We strive to provide premium products at competitive prices.
        </p>
      </section>

      <section className="about-values">
        <h2>Our Values</h2>
        <ul>
          <li>Customer Satisfaction: Your happiness is our priority.</li>
          <li>Quality Products: Only the best devices and accessories.</li>
          <li>Innovation: Stay ahead with the latest technology.</li>
          <li>Trust & Transparency: Honest service and clear policies.</li>
        </ul>
      </section>

      <section className="about-contact">
        <h2>Contact Us</h2>
        <p>Email: support@krstore.com</p>
        <p>Phone: +855 1234 5678</p>
        <p>Address: Phnom Penh, Cambodia</p>
      </section>
    </motion.div>
  );
};

export default AboutPage;
