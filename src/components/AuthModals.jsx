import React from "react";

const AuthModals = ({ showModal, onClose, onLogin, onSignup, onSwitch }) => {
  const handleSignInSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    onLogin({ name: email.split("@")[0], email });
  };

  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    const name = e.target.signupName.value;
    const email = e.target.signupEmail.value;
    onSignup({ name, email });
  };

  if (!showModal) return null;

  return (
    <div className="modal" style={{ display: "block" }}>
      <div className="modal-content">
        <span className="close-modal" onClick={onClose}>
          &times;
        </span>

        {showModal === "signin" ? (
          <>
            <h2>Sign In</h2>
            <form id="signin-form" onSubmit={handleSignInSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" required />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" required />
              </div>
              <button type="submit" className="cta-button">
                Sign In
              </button>
            </form>
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
            <form id="signup-form" onSubmit={handleSignUpSubmit}>
              <div className="form-group">
                <label htmlFor="signup-name">Full Name</label>
                <input type="text" id="signup-name" required />
              </div>
              <div className="form-group">
                <label htmlFor="signup-email">Email</label>
                <input type="email" id="signup-email" required />
              </div>
              <div className="form-group">
                <label htmlFor="signup-password">Password</label>
                <input type="password" id="signup-password" required />
              </div>
              <div className="form-group">
                <label htmlFor="signup-confirm">Confirm Password</label>
                <input type="password" id="signup-confirm" required />
              </div>
              <button type="submit" className="cta-button">
                Create Account
              </button>
            </form>
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
