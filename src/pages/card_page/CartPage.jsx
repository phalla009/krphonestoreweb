import React, { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeCanvas } from "qrcode.react";
import { BakongKHQR, khqrData, IndividualInfo } from "bakong-khqr";
import html2canvas from "html2canvas";
import "./CartPage.css";

/* global L */

// ─────────────────────────────────────────────
//  CONFIG  — change these to your real values
// ─────────────────────────────────────────────
const BAKONG_ACCOUNT_ID = "phallaheang@aclb"; // e.g. "sokha@acleda" or "dara@wing"
const MERCHANT_NAME = "KR Store"; // shown on payer's screen
const MERCHANT_CITY = "Phnom Penh";
const STORE_PHONE = "85512345678"; // your store phone (no +)
const STORE_LABEL = "KR Store";
const CURRENCY = khqrData.currency.usd; // or khqrData.currency.khr
const QR_EXPIRE_MS = 10 * 60 * 1000; // 10 minutes

// Optional: Bakong developer token for payment verification
// Register free at https://api-bakong.nbc.gov.kh/register
const BAKONG_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoiOGVjODFjOWQ1YWM0NDNjYyJ9LCJpYXQiOjE3NzQ3ODEzNzYsImV4cCI6MTc4MjU1NzM3Nn0.yO1ebNkwA17MFaYbsnzfDKw2RAYQUNwoAR5X040DD2Q";
// ─────────────────────────────────────────────

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
  const [khqrString, setKhqrString] = useState("");
  const [khqrMd5, setKhqrMd5] = useState("");
  const [billNumber, setBillNumber] = useState("");
  const [paymentChecking, setPaymentChecking] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [map, setMap] = useState(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

  const subtotal = cartItems.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0,
  );
  const shipping = 0;
  const total = subtotal + shipping;

  const formatPrice = (price) => `$${Number(price).toFixed(2)}`;

  // ── Auto-download receipt as PNG when modal opens ──
  useEffect(() => {
    if (showReceiptModal) {
      const element = document.getElementById("receipt");
      if (element) {
        setTimeout(() => {
          html2canvas(element, { scale: 2 }).then((canvas) => {
            const link = document.createElement("a");
            link.href = canvas.toDataURL("image/png");
            link.download = "receipt.png";
            link.click();
          });
        }, 300);
      }
    }
  }, [showReceiptModal]);

  // ── Leaflet map ──
  useEffect(() => {
    if (!showCheckoutModal || typeof L === "undefined") return;

    const mapElement = document.getElementById("checkout-map");
    if (!mapElement || mapElement._leaflet_id) return;

    const newMap = L.map(mapElement).setView([11.5564, 104.9282], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(newMap);

    const marker = L.marker([11.5564, 104.9282]).addTo(newMap);

    newMap.on("click", async (e) => {
      marker.setLatLng(e.latlng);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${e.latlng.lat}&lon=${e.latlng.lng}&zoom=18&addressdetails=1`,
        );
        const data = await res.json();
        setCheckoutForm((prev) => ({
          ...prev,
          latitude: e.latlng.lat,
          longitude: e.latlng.lng,
          address: data.display_name || "Unknown location",
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

    return () => {
      newMap.remove();
      setMap(null);
    };
  }, [showCheckoutModal]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCheckoutForm((prev) => ({ ...prev, [name]: value }));
  };

  // ── Generate real KHQR and open QR modal ──
  const handleCheckoutSubmit = (e) => {
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

    // Build a unique bill number for this order
    const newBillNumber = `ORD-${Date.now()}`;

    const optionalData = {
      currency: CURRENCY,
      amount: total,
      billNumber: newBillNumber,
      mobileNumber: STORE_PHONE,
      storeLabel: STORE_LABEL,
      terminalLabel: "Web-Checkout",
      expirationTimestamp: Date.now() + QR_EXPIRE_MS,
      merchantCategoryCode: "5999",
    };

    const individualInfo = new IndividualInfo(
      BAKONG_ACCOUNT_ID,
      CURRENCY,
      MERCHANT_NAME,
      MERCHANT_CITY,
      optionalData,
    );

    const khqr = new BakongKHQR();
    const response = khqr.generateIndividual(individualInfo);

    if (!response?.data?.qr) {
      alert(
        "Failed to generate KHQR code. Please check your Bakong account ID.",
      );
      return;
    }

    // Store QR data
    setKhqrString(response.data.qr);
    setKhqrMd5(response.data.md5);
    setBillNumber(newBillNumber);
    setOrderTotal(total);
    setPaymentConfirmed(false);

    // Prepare receipt data (saved now, shown after payment)
    setReceiptData({
      items: cartItems,
      total,
      billNumber: newBillNumber,
      customer: { fullname, email, phone, address },
      orderDate: new Date().toLocaleString(),
    });

    // Close checkout, open QR modal
    setShowCheckoutModal(false);
    setShowQRCodeModal(true);

    // Reset form
    setCheckoutForm({
      fullname: "",
      email: "",
      phone: "",
      address: "",
      latitude: null,
      longitude: null,
    });
  };

  // ── Poll Bakong API to verify payment ──
  const handleCheckPayment = async () => {
    if (!khqrMd5) return;
    setPaymentChecking(true);
    try {
      const res = await fetch(
        "https://api-bakong.nbc.gov.kh/v1/check_transaction_by_md5",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${BAKONG_TOKEN}`,
          },
          body: JSON.stringify({ md5: khqrMd5 }),
        },
      );
      const data = await res.json();

      // responseCode 0 = paid
      if (data?.responseCode === 0) {
        setPaymentConfirmed(true);
        setTimeout(() => {
          setShowQRCodeModal(false);
          setShowReceiptModal(true);
        }, 1200);
      } else {
        alert(
          "Payment not received yet. Please scan and pay, then check again.",
        );
      }
    } catch (err) {
      console.error(err);
      alert("Could not reach Bakong API. Please try again.");
    } finally {
      setPaymentChecking(false);
    }
  };

  // ── Skip verification (dev/test mode) ──
  const handleSkipVerification = () => {
    setShowQRCodeModal(false);
    setShowReceiptModal(true);
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

      {/* ── Delete Confirmation Modal ── */}
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

      {/* ── Checkout Modal ── */}
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
                  {/* Left: Input fields */}
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
                      placeholder="Address (click map to fill)"
                      value={checkoutForm.address}
                      onChange={handleInputChange}
                      readOnly
                      style={{
                        backgroundColor: "rgba(0,0,0,0.7)",
                        color: "#fff",
                      }}
                    />
                    {checkoutForm.latitude && checkoutForm.longitude && (
                      <small style={{ color: "#28a745" }}>
                        ✓ Location selected
                      </small>
                    )}
                  </div>

                  {/* Right: Map */}
                  <div style={{ flex: 1, minWidth: "300px" }}>
                    <label>Delivery Location</label>
                    <div
                      id="checkout-map"
                      style={{
                        height: "300px",
                        borderRadius: "8px",
                        border: "1px solid #ddd",
                      }}
                    />
                    <small>
                      Click on the map to set your delivery location
                    </small>
                  </div>
                </div>

                <div className="modal-actions">
                  <button type="submit" className="ok-confirm">
                    Proceed to Payment
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

      {/* ── KHQR Payment Modal ── */}
      <AnimatePresence>
        {showQRCodeModal && khqrString && (
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
              style={{ textAlign: "center" }}
            >
              {paymentConfirmed ? (
                <>
                  <div style={{ fontSize: "60px" }}>✅</div>
                  <h3 style={{ color: "#28a745" }}>Payment Confirmed!</h3>
                  <p>Redirecting to your receipt…</p>
                </>
              ) : (
                <>
                  {/* Bakong logo + title */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "10px",
                      marginBottom: "4px",
                    }}
                  >
                    <img
                      src="https://bakong.nbc.gov.kh/images/logo.svg"
                      alt="Bakong"
                      style={{ height: "32px" }}
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                    <h3 style={{ margin: 0 }}>Scan to Pay</h3>
                  </div>
                  <p
                    style={{
                      margin: "4px 0 2px",
                      color: "#aaa",
                      fontSize: "13px",
                    }}
                  >
                    Works with Bakong, ABA, ACLEDA, Wing &amp; all Cambodian
                    banking apps
                  </p>

                  {/* Amount */}
                  <p
                    style={{
                      fontSize: "22px",
                      fontWeight: "bold",
                      margin: "10px 0",
                    }}
                  >
                    {formatPrice(orderTotal)}
                  </p>

                  {/* QR Code */}
                  <div
                    style={{
                      display: "inline-block",
                      padding: "12px",
                      background: "#fff",
                      borderRadius: "12px",
                      margin: "10px auto",
                    }}
                  >
                    <QRCodeCanvas
                      value={khqrString}
                      size={220}
                      includeMargin={false}
                    />
                  </div>

                  {/* Bill number & expiry note */}
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#888",
                      margin: "6px 0 0",
                    }}
                  >
                    Order: {billNumber}
                  </p>
                  <p
                    style={{
                      fontSize: "11px",
                      color: "#e74c3c",
                      margin: "2px 0 14px",
                    }}
                  >
                    QR expires in 10 minutes
                  </p>

                  <div className="modal-actions">
                    {/* Primary: verify payment via Bakong API */}
                    <button
                      className="ok-confirm"
                      onClick={handleCheckPayment}
                      disabled={paymentChecking}
                    >
                      {paymentChecking ? "Checking…" : "I've Paid ✓"}
                    </button>

                    {/* Secondary: skip verification (useful in dev/test) */}
                    <button
                      className="cancel"
                      onClick={handleSkipVerification}
                      disabled={paymentChecking}
                    >
                      Skip Verification
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Receipt Modal ── */}
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
                  <span className="receipt-label">Order #:</span>
                  <span className="receipt-value">
                    {receiptData.billNumber}
                  </span>
                </div>
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

              <div className="receipt-divider" />

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

              <div className="receipt-divider" />

              <div className="receipt-total">
                <span>Grand Total:</span>
                <span className="receipt-total-amount">
                  {formatPrice(receiptData.total)}
                </span>
              </div>

              <div
                style={{
                  textAlign: "center",
                  margin: "12px 0 4px",
                  fontSize: "12px",
                  color: "#28a745",
                }}
              >
                ✅ Paid via Bakong KHQR
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
                        link.download = `receipt-${receiptData.billNumber}.png`;
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
