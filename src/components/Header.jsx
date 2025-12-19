import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
const Header = ({ user, onLoginClick, onLogout, cartCount }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header>
      <div className="logo">
        <Link to="/">KR STORE</Link>
      </div>

      <div className="nav-right">
        <nav>
          <ul className="nav-links">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/products"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                Products
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/categories"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                Categories
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/brands"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                Brands
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/cart"
                className={({ isActive }) =>
                  isActive
                    ? "cart-icon-container active"
                    : "cart-icon-container"
                }
              >
                <svg className="cart-icon" viewBox="0 0 24 24">
                  <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
                </svg>
                {cartCount > 0 && (
                  <span className="cart-badge">{cartCount}</span>
                )}
              </NavLink>
            </li>
          </ul>
        </nav>
        <div className="search-container">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search for products..."
              className="search-input"
            />
            <button className="search-button">
              <svg className="search-icon" viewBox="0 0 24 24">
                <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              </svg>
            </button>
          </div>
          <div className="search-results"></div>
        </div>
        <div className="user-auth">
          {user ? (
            <div className="user-profile">
              <span>{user.name}</span>
              <button onClick={onLogout} className="auth-btn">
                Logout
              </button>
            </div>
          ) : (
            <button onClick={onLoginClick} className="auth-btn">
              Sign In
            </button>
          )}
        </div>
        <div className="mobile-menu-btn" onClick={toggleMobileMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <div className={`mobile-menu ${isMobileMenuOpen ? "open" : ""}`}>
        <ul className="mobile-menu-links">
          <li>
            <Link to="/" onClick={toggleMobileMenu}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/products" onClick={toggleMobileMenu}>
              Products
            </Link>
          </li>
          <li>
            <Link to="/categories" onClick={toggleMobileMenu}>
              Categories
            </Link>
          </li>
          <li>
            <Link to="/brands" onClick={toggleMobileMenu}>
              Brands
            </Link>
          </li>
          <li>
            <NavLink
              to="/cart"
              className={({ isActive }) =>
                isActive ? "cart-icon-container active" : "cart-icon-container"
              }
            >
              <svg className="cart-icon" viewBox="0 0 24 24">
                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
              </svg>
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </NavLink>
          </li>
          <li className="mobile-auth">
            {user ? (
              <div className="user-profile">
                <span>{user.name}</span>
                <button onClick={onLogout} className="auth-btn">
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  onLoginClick();
                  toggleMobileMenu();
                }}
                className="auth-btn"
              >
                Sign In
              </button>
            )}
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
