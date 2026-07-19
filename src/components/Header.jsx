import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

const Header = ({ user, onLoginClick, onLogout, cartCount }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false); // <-- Add this
  const navigate = useNavigate();

  const displayName =
    user?.fullName ||
    user?.firstName ||
    user?.username ||
    user?.primaryEmailAddress?.emailAddress ||
    "Profile";

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen); // <-- Add this

  return (
    <header>
      <div className="logo">
        <Link to="/">
          <img src="/images/logo.png" alt="KRPhone Store" className="logo-img" />
          KRPhone STORE
        </Link>
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
            {/* <li>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                About
              </NavLink>
            </li> */}
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
        <div className="user-auth">
          {user ? (
            <div
              className="user-profile-container"
              style={{ position: "relative" }}
            >
              <FaUserCircle
                size={32}
                style={{ cursor: "pointer" }}
                onClick={toggleUserMenu}
              />
              {isUserMenuOpen && (
                <div
                  className="user-dropdown"
                  style={{
                    position: "absolute",
                    top: "40px",
                    right: 0,
                    background: "#000000ff",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    padding: "10px 12px",
                    minWidth: "150px",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                    zIndex: 100,
                  }}
                >
                  <p style={{ margin: 0, fontWeight: "bold" }}>{displayName}</p>
                  <button
                    onClick={() => {
                      onLogout();
                      setIsUserMenuOpen(false);
                    }}
                    className="auth-btn"
                    style={{ marginTop: "8px", width: "100%" }}
                  >
                    Logout
                  </button>
                </div>
              )}
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
      {isMobileMenuOpen && (
        <div className="menu-overlay" onClick={toggleMobileMenu}></div>
      )}
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
                <span>{displayName}</span>
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
