import React, { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeCanvas } from "qrcode.react";
import html2pdf from "html2pdf.js";
import html2canvas from "html2canvas";
import "./CartPage.css";

/* global L */

const CartPage = ({ cartItems, removeFromCart, updateQuantity }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({
    fullname: "",
    email: "",
    phone: "",
    address: "",
    latitude: null,
    longitude: null,
  });
  const [showQRCodeModal, setShowQRCodeModal] = useState(false);
  const [orderTotal, setOrderTotal] = useState(0);
  const [paymentUrl, setPaymentUrl] = useState("");
  const [map, setMap] = useState(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

  const subtotal = cartItems.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0
  );
  const shipping = subtotal > 0 ? 0 : 0;
  const total = subtotal + shipping;

  const formatPrice = (price) => `$${Number(price).toFixed(2)}`;
  // Auto-download receipt PDF when modal opens
  useEffect(() => {
    if (showReceiptModal) {
      const element = document.getElementById("receipt");
      if (element) {
        html2canvas(element, { scale: 2 }).then((canvas) => {
          const link = document.createElement("a");
          link.href = canvas.toDataURL("image/png");
          link.download = "receipt.png";
          link.click();
        });
      }
    }
  }, [showReceiptModal]);

  // ---- MAP EFFECT ----
  useEffect(() => {
    if (!showCheckoutModal || typeof L === "undefined") return;

    const mapElement = document.getElementById("checkout-map");
    if (!mapElement) return;

    if (!mapElement._leaflet_id) {
      const newMap = L.map(mapElement).setView([11.5564, 104.9282], 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(newMap);

      const marker = L.marker([11.5564, 104.9282]).addTo(newMap);

      newMap.on("click", async (e) => {
        marker.setLatLng(e.latlng);
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${e.latlng.lat}&lon=${e.latlng.lng}&zoom=18&addressdetails=1`
          );
          const data = await res.json();
          const fullAddress = data.display_name || "Unknown location";

          setCheckoutForm((prev) => ({
            ...prev,
            latitude: e.latlng.lat,
            longitude: e.latlng.lng,
            address: fullAddress,
          }));
        } catch {
          setCheckoutForm((prev) => ({
            ...prev,
            latitude: e.latlng.lat,
            longitude: e.latlng.lng,
          }));
        }
      });

      setMap(newMap);
    }

    return () => {
      if (map) {
        map.remove();
        setMap(null);
      }
    };
  }, [showCheckoutModal]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCheckoutForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    const { fullname, email, phone, address, latitude, longitude } =
      checkoutForm;

    if (!fullname || !email || !phone || !address) {
      alert("Please fill in all fields!");
      return;
    }

    if (!latitude || !longitude) {
      alert("Please select a delivery location on the map!");
      return;
    }

    const tempPaymentUrl = "https://example.com/payment-temp";
    setPaymentUrl(tempPaymentUrl);
    setOrderTotal(total);
    setShowCheckoutModal(false);
    setShowQRCodeModal(true);
    setReceiptData({
      items: cartItems,
      total,
      customer: {
        fullname,
        email,
        phone,
        address,
      },
      orderDate: new Date().toLocaleString(),
    });

    setCheckoutForm({
      fullname: "",
      email: "",
      phone: "",
      address: "",
      latitude: null,
      longitude: null,
    });

    try {
      const response = await fetch(
        "https://krstoreapi.phalla.lol/api/payment",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: total,
            fullname,
            email,
            phone,
            address,
            latitude,
            longitude,
          }),
        }
      );

      if (!response.ok) throw new Error("Payment creation failed");

      const data = await response.json();
      setPaymentUrl(data.url);
    } catch (error) {
      console.error(error);
      // alert("Failed to generate real payment QR code. Using temporary link.");
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
            <button
              className="order-button"
              onClick={() => setShowCheckoutModal(true)}
            >
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

      {/* Checkout Modal */}
      <AnimatePresence>
        {showCheckoutModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="modal-content checkout-modal"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h3>Enter Your Information</h3>
              <form onSubmit={handleCheckoutSubmit} className="checkout-form">
                <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                  <div
                    style={{
                      flex: 1,
                      minWidth: "300px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    <input
                      type="text"
                      name="fullname"
                      placeholder="Full Name"
                      value={checkoutForm.fullname}
                      onChange={handleInputChange}
                      required
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={checkoutForm.email}
                      onChange={handleInputChange}
                      required
                    />
                    <input
                      type="text"
                      name="phone"
                      placeholder="Phone Number"
                      value={checkoutForm.phone}
                      onChange={handleInputChange}
                      required
                    />
                    <input
                      type="text"
                      name="address"
                      placeholder="Address"
                      value={checkoutForm.address}
                      onChange={handleInputChange}
                      readOnly
                      style={{
                        backgroundColor: "rgba(0, 0, 0, 0.7)",
                        color: "#fff",
                      }}
                    />

                    {checkoutForm.latitude && checkoutForm.longitude && (
                      <small style={{ color: "#28a745" }}>
                        ✓ Location selected
                      </small>
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: "300px" }}>
                    <label>Delivery Location</label>
                    <div
                      id="checkout-map"
                      style={{
                        height: "300px",
                        borderRadius: "8px",
                        border: "1px solid #ddd",
                      }}
                    ></div>
                    <small>
                      Click on the map to set your delivery location
                    </small>
                  </div>
                </div>
                <div className="modal-actions">
                  <button type="submit" className="ok-confirm">
                    Proceed
                  </button>
                  <button
                    type="button"
                    className="cancel"
                    onClick={() => setShowCheckoutModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
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
            >
              <h3>Scan to Pay with Bakong</h3>
              <p>Total Amount: {formatPrice(orderTotal)}</p>
              <div style={{ textAlign: "center", margin: "20px 0" }}>
                <QRCodeCanvas value={paymentUrl} size={200} />
              </div>
              <div className="modal-actions">
                <button
                  className="ok-confirm"
                  onClick={() => {
                    setShowQRCodeModal(false);
                    setShowReceiptModal(true);
                  }}
                >
                  OK
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Receipt Modal */}
      <AnimatePresence>
        {showReceiptModal && receiptData && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              id="receipt"
              className="modal-content receipt-modal"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <div className="receipt-header">
                <h3>🧾 Order Receipt</h3>
                <p className="receipt-subtitle">Thank you for your purchase!</p>
              </div>

              <div className="receipt-info">
                <div className="receipt-info-row">
                  <span className="receipt-label">Date:</span>
                  <span className="receipt-value">{receiptData.orderDate}</span>
                </div>
                <div className="receipt-info-row">
                  <span className="receipt-label">Name:</span>
                  <span className="receipt-value">
                    {receiptData.customer.fullname}
                  </span>
                </div>
                <div className="receipt-info-row">
                  <span className="receipt-label">Phone:</span>
                  <span className="receipt-value">
                    {receiptData.customer.phone}
                  </span>
                </div>
                <div className="receipt-info-row">
                  <span className="receipt-label">Address:</span>
                  <span className="receipt-value">
                    {receiptData.customer.address}
                  </span>
                </div>
              </div>

              <div className="receipt-divider"></div>

              <div className="receipt-items">
                <table className="receipt-table">
                  <thead>
                    <tr>
                      <th align="left">Product</th>
                      <th>Qty</th>
                      <th align="right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {receiptData.items.map((item) => (
                      <tr key={item.id}>
                        <td className="receipt-product-name">{item.name}</td>
                        <td align="center" className="receipt-qty">
                          {item.quantity}
                        </td>
                        <td align="right" className="receipt-price">
                          {formatPrice(item.price * item.quantity)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="receipt-divider"></div>

              <div className="receipt-total">
                <span>Grand Total:</span>
                <span className="receipt-total-amount">
                  {formatPrice(receiptData.total)}
                </span>
              </div>

              <div className="modal-actions">
                <button
                  className="print-button"
                  onClick={() => {
                    const element = document.getElementById("receipt");
                    if (element) {
                      html2canvas(element, { scale: 2 }).then((canvas) => {
                        const link = document.createElement("a");
                        link.href = canvas.toDataURL("image/png");
                        link.download = "receipt.png";
                        link.click();
                      });
                    }
                  }}
                >
                  Download Receipt (PNG)
                </button>

                <button
                  className="ok-confirm"
                  onClick={() => setShowReceiptModal(false)}
                >
                  Close
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
