import React from "react";
import { SignIn } from "@clerk/clerk-react";

const AuthModals = ({ showModal, onClose }) => {
  if (!showModal) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ position: "relative" }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: "absolute",
            top: "10px",
            right: "12px",
            border: "none",
            background: "transparent",
            fontSize: "22px",
            cursor: "pointer",
          }}
        >
          ×
        </button>

        {/* Sign In only */}
        <SignIn
          routing="virtual"
          appearance={{
            elements: {
              footer: "hidden", 
            },
          }}
        />
      </div>
    </div>
  );
};

export default AuthModals;
