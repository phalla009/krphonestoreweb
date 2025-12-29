import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ClerkProvider } from "@clerk/clerk-react";

const PUBLISHABLE_KEY = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    {PUBLISHABLE_KEY ? (
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <App />
      </ClerkProvider>
    ) : (
      <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
        <h2>Missing Clerk Publishable Key</h2>
        <p>
          Set <code>REACT_APP_CLERK_PUBLISHABLE_KEY</code> in your environment
          (e.g. a <code>.env</code> file) and restart the dev server.
        </p>
      </div>
    )}
  </React.StrictMode>
);
