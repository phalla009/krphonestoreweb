import React, { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeCanvas } from "qrcode.react";
import "./CartPage.css";

const CartPage = ({ cartItems, removeFromCart, updateQuantity }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [showQRCodeModal, setShowQRCodeModal] = useState(false);
  const [orderTotal, setOrderTotal] = useState(0);
  const [paymentUrl, setPaymentUrl] = useState("");

  // Calculate totals
  const subtotal = cartItems.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0
  );
  const shipping = subtotal > 0 ? 0 : 0;
  const total = subtotal + shipping;

  const formatPrice = (price) => `$${Number(price).toFixed(2)}`;

  // Place order -> request Laravel API
  const handleOrderClick = async () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total }),
      });

      if (!response.ok) throw new Error("Payment creation failed");

      const data = await response.json();
      setPaymentUrl(data.url);
      setOrderTotal(total);
      setShowQRCodeModal(true);
    } catch (error) {
      console.error(error);
      alert("Failed to generate payment QR code. Please try again.");
    }
  };

  return (
    <div className="cart-page">
      <h2>Your Shopping Cart</h2>

      {cartItems.length === 0 ? (
        <p>Your cart is empty!</p>
      ) : (
        <>
          <table className="cart-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {cartItems.map((item) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td className="cart-product">
                      <img src={item.images[0]} alt={item.name} />
                      <span>{item.name}</span>
                    </td>
                    <td>{formatPrice(item.price)}</td>
                    <td>
                      <div className="quantity-controls">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                        >
                          –
                        </button>
                        <span className="qty-number">{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          disabled={item.quantity >= item.stock}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td>{formatPrice(Number(item.price) * item.quantity)}</td>
                    <td>
                      <button
                        className="remove-button"
                        onClick={() => {
                          setItemToDelete(item);
                          setShowDeleteModal(true);
                        }}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>

          <div className="cart-summary">
            <p>Subtotal: {formatPrice(subtotal)}</p>
            <p>Shipping: {shipping === 0 ? "Free" : formatPrice(shipping)}</p>
            <p>Total: {formatPrice(total)}</p>

            <button className="order-button" onClick={handleOrderClick}>
              Place Order
            </button>
          </div>
        </>
      )}

      {/* Delete Modal */}
      <AnimatePresence>
        {showDeleteModal && itemToDelete && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3>Remove Item</h3>
              <p>Are you sure you want to remove "{itemToDelete.name}"?</p>
              <div className="modal-actions">
                <button
                  className="delete-confirm"
                  onClick={() => {
                    removeFromCart(itemToDelete.id);
                    setShowDeleteModal(false);
                    setItemToDelete(null);
                  }}
                >
                  Yes, Remove
                </button>
                <button
                  className="cancel"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setItemToDelete(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* QR Code Modal */}
      <AnimatePresence>
        {showQRCodeModal && paymentUrl && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3>Scan to Pay with Bakong</h3>
              <p>Total Amount: {formatPrice(orderTotal)}</p>

              <div style={{ textAlign: "center", margin: "20px 0" }}>
                <QRCodeCanvas value={paymentUrl} size={200} />
              </div>

              <div className="modal-actions" style={{ marginTop: "20px" }}>
                <button
                  className="ok-confirm"
                  onClick={() => setShowQRCodeModal(false)}
                >
                  OK
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CartPage;
