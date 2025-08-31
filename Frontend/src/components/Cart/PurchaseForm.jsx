import React, { useState } from "react";
import { clearCart, clearCartServer } from "../../redux/slices/cartSlice";
import { useDispatch, useSelector } from "react-redux";

import { useAuth } from "../../context/AuthContext";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_BACKEND_URL || "https://localhost:3001";
const districts = [
  "Colombo", "Gampaha", "Kandy", "Galle", "Matara", "Kurunegala", "Jaffna", "Badulla", "Anuradhapura", "Ratnapura"
];
// products will be taken from cart
const deliveryTimes = ["10 AM", "11 AM", "1 PM","2 PM","3 PM","4 PM","5 PM","6 PM"];

function PurchaseForm({ onPurchase }) {
  const dispatch = useDispatch();
  const { getAccessTokenSilently } = useAuth0();
  const { user: authUser } = useAuth();
  const cart = useSelector((state) => state.cart.cart);
  const navigate = useNavigate();
  const cartProducts = cart?.products || [];
  const totalQuantity = cartProducts.reduce((sum, p) => sum + (p.quantity || 0), 0);
  const { user: auth0User } = useAuth0();
  const [form, setForm] = useState({
    dateOfPurchase: "",
    deliveryTime: "10 AM",
    deliveryLocation: districts[0],
    address: auth0User?.address || "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Disable Sundays in date picker
  const isSunday = (dateStr) => {
    const date = new Date(dateStr);
    return date.getDay() === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "dateOfPurchase") {
      // Prevent selecting Sundays
      if (value) {
        const date = new Date(value);
        if (date.getDay() === 0) {
          setError("Purchases cannot be made on Sundays.");
          setForm((prev) => ({ ...prev, [name]: "" }));
          return;
        }
      }
      setError("");
    }
    if (name === "message") {
      // Limit message length and block suspicious input
      if (value.length > 200) {
        setError("Message must be 200 characters or less.");
        return;
      }
      // Basic suspicious input check (block <script> tags)
      if (/\<\s*script/i.test(value)) {
        setError("Message cannot contain script tags.");
        return;
      }
      setError("");
    }
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!form.dateOfPurchase) {
      setError("Please select a date of purchase.");
      return;
    }
    if (isSunday(form.dateOfPurchase)) {
      setError("Purchases cannot be made on Sundays.");
      return;
    }
    if (cartProducts.length === 0) {
      setError("Your cart is empty.");
      return;
    }
    setLoading(true);
    try {
      const token = await getAccessTokenSilently();
      const payload = {
        user: authUser?._id || auth0User?.sub || "",
        username: authUser?.name || authUser?.nickname || authUser?.email || auth0User?.name || auth0User?.nickname || auth0User?.email || "",
        orderItems: cartProducts.map(p => ({
          productId: p.productId,
          name: p.name,
          quantity: p.quantity,
          size: p.size,
          color: p.color,
          price: p.price,
          image: p.image || (p.images ? p.images[0] : ""),
        })),
        shippingAddress: {
          address: form.address,
          city: form.deliveryLocation || "Colombo",
          country: "Sri Lanka"
        },
        paymentMethod: "Cash",
        totalPrice: cartProducts.reduce((sum, p) => sum + p.price * p.quantity, 0),
        dateOfPurchase: form.dateOfPurchase,
        deliveryTime: form.deliveryTime || "10 AM",
        deliveryLocation: form.deliveryLocation || "Colombo",
        message: form.message
      };
    //  console.log("Order payload:", payload);
  const res = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to create purchase.");
      } else {
        setSuccess("Purchase created successfully!");
        setForm({
          dateOfPurchase: "",
          deliveryTime: "10 AM",
          deliveryLocation: districts[0],
          address: auth0User?.address || "",
          message: ""
        });
        // Clear cart on backend and frontend
        const userId = data.user || (data.user?._id);
        const guestId = localStorage.getItem('guestId');
        dispatch(clearCartServer({ userId, guestId, token }));
        dispatch(clearCart());
        if (onPurchase) onPurchase(data);
        // Navigate to Order Confirmation page with order data
        navigate("/order-confirmation", { state: { order: data } });
      }
    } catch (err) {
      setError("Error creating purchase.");
    }
    setLoading(false);
  };

  return (
    <form className="bg-white p-6 rounded-lg shadow-md space-y-4" onSubmit={handleSubmit}>
      <h2 className="text-lg font-bold text-gray-700 mb-2">Purchase Product</h2>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      {success && <div className="text-green-500 text-sm">{success}</div>}
      {/* Product selection removed. All cart items will be purchased. */}
      <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-2">
        <h3 className="text-sm font-semibold text-green-700 mb-1">Products to be purchased:</h3>
        {cartProducts.length === 0 ? (
          <p className="text-gray-500">Your cart is empty.</p>
        ) : (
          <ul className="list-disc pl-5 text-gray-700">
            {cartProducts.map((p, idx) => (
              <li key={idx}>
                {p.name} <span className="text-xs text-gray-500">(Qty: {p.quantity}{p.size ? `, Size: ${p.size}` : ""}{p.color ? `, Color: ${p.color}` : ""})</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-600">Total Quantity</label>
        <input
          type="number"
          name="quantity"
          value={totalQuantity}
          readOnly
          className="mt-1 block w-full border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-600">Date of Purchase</label>
        <input type="date" name="dateOfPurchase" value={form.dateOfPurchase} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md" min={new Date().toISOString().split("T")[0]} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-600">Preferred Delivery Time</label>
        <select name="deliveryTime" value={form.deliveryTime} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md">
          {deliveryTimes.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-600">Street Address</label>
        <input
          type="text"
          name="address"
          value={form.address}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md"
          placeholder="Enter your street address"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-600">Preferred Delivery Location (District)</label>
        <select name="deliveryLocation" value={form.deliveryLocation} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md">
          {districts.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-600">Message</label>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md"
          rows={2}
          maxLength={200}
          placeholder="Optional message (max 200 characters)"
        />
      </div>
      <button type="submit" disabled={loading} className="w-full bg-green-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-green-700 transition-all">
        {loading ? "Processing..." : "Purchase"}
      </button>
    </form>
  );
}

export default PurchaseForm;
