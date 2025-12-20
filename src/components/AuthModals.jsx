import React, { useState } from "react";
import "./AuthModals.css";

const AuthModals = ({ showModal, onClose, onLogin, onSignup, onSwitch }) => {
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");

  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpConfirm, setSignUpConfirm] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [emailError, setEmailError] = useState("");

  // ✅ Email validation
  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // ================= SIGN IN =================
  const handleSignInSubmit = (e) => {
    e.preventDefault();

    if (!isValidEmail(signInEmail)) {
      setEmailError("Invalid email format (user@gmail.com)");
      return;
    }

    if (signInEmail && signInPassword) {
      onLogin({ name: signInEmail.split("@")[0], email: signInEmail });
      setSignInEmail("");
      setSignInPassword("");
      setEmailError("");
    }
  };

  // ================= SIGN UP =================
  const handleSignUpSubmit = (e) => {
    e.preventDefault();

    if (!isValidEmail(signUpEmail)) {
      setErrorMessage("Invalid email format (user@gmail.com)");
      return;
    }

    if (signUpPassword !== signUpConfirm) {
      setErrorMessage("Passwords do not match!");
      return;
    }

    setErrorMessage("");
    onSignup({ name: signUpName, email: signUpEmail });

    setSignUpName("");
    setSignUpEmail("");
    setSignUpPassword("");
    setSignUpConfirm("");
  };

  // ================= GOOGLE =================
  const handleGoogleSignIn = () => {
    onLogin({
      name: "Google User",
      email: "user@gmail.com",
      provider: "google",
    });
  };

  if (!showModal) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close-modal" onClick={onClose}>
          &times;
        </span>

        {showModal === "signin" ? (
          <>
            <h2>Sign In</h2>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={signInEmail}
                onChange={(e) => {
                  setSignInEmail(e.target.value);
                  setEmailError("");
                }}
                onBlur={() =>
                  signInEmail &&
                  !isValidEmail(signInEmail) &&
                  setEmailError("Invalid email format (user@gmail.com)")
                }
                className={emailError ? "input-error" : ""}
                required
              />
              {emailError && <p className="error-text">{emailError}</p>}
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={signInPassword}
                onChange={(e) => setSignInPassword(e.target.value)}
                required
              />
            </div>

            <button
              onClick={handleSignInSubmit}
              disabled={!signInEmail || !signInPassword}
              className="cta-button"
            >
              Sign In
            </button>

            <div className="divider">
              <span>or</span>
            </div>

            <button onClick={handleGoogleSignIn} className="google-button">
              Continue with Google
            </button>

            <p className="auth-switch">
              Don't have an account?{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onSwitch("signup");
                }}
              >
                Sign Up
              </a>
            </p>
          </>
        ) : (
          <>
            <h2>Sign Up</h2>

            {errorMessage && (
              <div className="error-message">{errorMessage}</div>
            )}

            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={signUpName}
                onChange={(e) => setSignUpName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={signUpEmail}
                onChange={(e) => {
                  setSignUpEmail(e.target.value);
                  setErrorMessage("");
                }}
                className={errorMessage.includes("email") ? "input-error" : ""}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={signUpPassword}
                onChange={(e) => setSignUpPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                value={signUpConfirm}
                onChange={(e) => setSignUpConfirm(e.target.value)}
                required
              />
            </div>

            <button
              onClick={handleSignUpSubmit}
              disabled={
                !signUpName || !signUpEmail || !signUpPassword || !signUpConfirm
              }
              className="cta-button"
            >
              Create Account
            </button>

            <div className="divider">
              <span>or</span>
            </div>

            <button onClick={handleGoogleSignIn} className="google-button">
              Continue with Google
            </button>

            <p className="auth-switch">
              Already have an account?{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onSwitch("signin");
                }}
              >
                Sign In
              </a>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthModals;
