import React from "react";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer>
      <div className="container">
        <motion.div
          className="footer-content"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          {/* Shop Column */}
          <motion.div
            className="footer-column"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <h3>Shop</h3>
            <ul className="footer-links">
              <li>
                <a href="/products">All Products</a>
              </li>
              <li>
                <a href="/products">New Arrivals</a>
              </li>
              <li>
                <a href="/products">Best Sellers</a>
              </li>
              <li>
                <a href="/products">Special Offers</a>
              </li>
              <li>
                <a href="/products">Accessories</a>
              </li>
            </ul>
          </motion.div>

          {/* Support Column */}
          <motion.div
            className="footer-column"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <h3>Support</h3>
            <ul className="footer-links">
              <li>
                <a href="#">Contact Us</a>
              </li>
              <li>
                <a href="#">FAQs</a>
              </li>
              <li>
                <a href="#">Shipping Policy</a>
              </li>
              <li>
                <a href="#">Returns & Warranty</a>
              </li>
              <li>
                <a href="#">Device Trade-In</a>
              </li>
            </ul>
          </motion.div>

          {/* Company Column */}
          <motion.div
            className="footer-column"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <h3>Company</h3>
            <ul className="footer-links">
              <li>
                <a href="#">About Us</a>
              </li>
              <li>
                <a href="#">Careers</a>
              </li>
              <li>
                <a href="#">Blog</a>
              </li>
              <li>
                <a href="#">Press</a>
              </li>
              <li>
                <a href="#">Investors</a>
              </li>
            </ul>
          </motion.div>

          {/* Connect Column */}
          {/* Connect Column */}
          <motion.div
            className="footer-column"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
          >
            <h3>Connect</h3>
            <p>
              Subscribe to our newsletter for the latest updates and offers.
            </p>

            <div className="social-links flex gap-4 mt-3">
              {[
                {
                  name: "Github",
                  url: "https://github.com/phalla009?tab=repositories",
                  svg: (
                    <path
                      d="M12 .5C5.73.5.5 5.73.5 12.02c0 5.1 3.29 
                        9.42 7.86 10.96.58.1.79-.25.79-.56 
                        0-.28-.01-1.02-.02-2-3.2.7-3.87-1.54-3.87-1.54-.53-1.34-1.3-1.7-1.3-1.7-1.06-.73.08-.72.08-.72 
                        1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 
                        2.74 1.27 3.41.97.1-.75.41-1.27.74-1.56-2.55-.29-5.23-1.28-5.23-5.7 
                        0-1.26.45-2.3 1.2-3.11-.12-.3-.52-1.48.11-3.08 
                        0 0 .97-.31 3.18 1.19a11.1 11.1 0 0 1 2.9-.39c.98 0 
                        1.97.13 2.9.39 2.2-1.5 3.17-1.19 
                        3.17-1.19.63 1.6.23 2.78.11 3.08.75.81 
                        1.2 1.85 1.2 3.11 0 4.43-2.69 5.41-5.25 
                        5.7.42.36.79 1.08.79 2.17 
                        0 1.56-.01 2.82-.01 3.2 0 .31.21.67.8.55A10.99 
                        10.99 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5z"
                    />
                  ),
                },
                {
                  name: "twitter",
                  url: "https://twitter.com/yourusername",
                  svg: (
                    <path
                      d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 
                  4.48 0 0 0-7.86 3v1A10.66 
                  10.66 0 0 1 3 4s-4 9 5 13a11.64 
                  11.64 0 0 1-7 2c9 5 20 0 
                  20-11.5a4.5 4.5 0 0 0-.08-.83z"
                    />
                  ),
                },
                {
                  name: "facebook",
                  url: "https://www.facebook.com/heangphalla009",
                  svg: (
                    <path
                      d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 
                  0 0 1 1-1h3z"
                    />
                  ),
                },
                {
                  name: "instagram",
                  url: "https://instagram.com/yourusername",
                  svg: (
                    <path
                      d="M7 2C4.2 2 2 4.2 2 7v10c0 
                  2.8 2.2 5 5 5h10c2.8 0 5-2.2 
                  5-5V7c0-2.8-2.2-5-5-5H7zm10 
                  2a3 3 0 0 1 3 3v10a3 3 0 0 
                  1-3 3H7a3 3 0 0 1-3-3V7a3 3 
                  0 0 1 3-3h10zm-5 3a5 5 0 1 
                  0 0 10 5 5 0 0 0 0-10zm0 
                  2a3 3 0 1 1 0 6 3 3 0 0 
                  1 0-6zm4.5-.8a1.2 1.2 0 1 
                  0 0 2.4 1.2 1.2 0 0 0 
                  0-2.4z"
                    />
                  ),
                },
                {
                  name: "youtube",
                  url: "https://www.youtube.com/@heangphalla",
                  svg: (
                    <path
                      d="M19.6 3.2H4.4C2.9 3.2 1.6 4.5 
                  1.6 6v12c0 1.5 1.3 2.8 2.8 
                  2.8h15.2c1.5 0 2.8-1.3 
                  2.8-2.8V6c0-1.5-1.3-2.8-2.8-2.8zM10 
                  15.5V8.5l6 3.5-6 3.5z"
                    />
                  ),
                },
              ].map((social, i) => (
                <motion.a
                  key={i}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <svg
                    className="social-icon w-6 h-6 text-gray-600 hover:text-blue-500"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {social.svg}
                  </svg>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Copyright */}
        <motion.div
          className="copyright"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          &copy; 2025 KR Store. All rights reserved.
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
