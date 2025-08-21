import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const districts = [
  "Colombo", "Gampaha", "Kandy", "Galle", "Matara", "Kurunegala", "Jaffna", "Badulla", "Anuradhapura", "Ratnapura"
];
const products = [
  "T-Shirt", "Dress", "Shoes", "Bag", "Watch", "Sunglasses", "Hat", "Jeans", "Jacket", "Skirt"
];
const deliveryTimes = ["10 AM", "11 AM", "12 PM"];

function PurchaseForm({ onPurchase }) {
  const { getAccessTokenSilently } = useAuth0();
  const [form, setForm] = useState({
    productName: "T-Shirt",
    quantity: 1,
    dateOfPurchase: "",
    deliveryTime: "10 AM",
    deliveryLocation: districts[0],
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
    setLoading(true);
    try {
      const token = await getAccessTokenSilently();
      const res = await fetch("/api/purchases", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to create purchase.");
      } else {
        setSuccess("Purchase created successfully!");
        setForm({
          productName: "T-Shirt",
          quantity: 1,
          dateOfPurchase: "",
          deliveryTime: "10 AM",
          deliveryLocation: districts[0],
          message: ""
        });
        if (onPurchase) onPurchase(data);
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
      <div>
        <label className="block text-sm font-medium text-gray-600">Product</label>
        <select name="productName" value={form.productName} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md">
          {products.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-600">Quantity</label>
        <input type="number" name="quantity" min="1" value={form.quantity} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md" />
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
        <label className="block text-sm font-medium text-gray-600">Preferred Delivery Location</label>
        <select name="deliveryLocation" value={form.deliveryLocation} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md">
          {districts.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-600">Message</label>
        <textarea name="message" value={form.message} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md" rows={2} />
      </div>
      <button type="submit" disabled={loading} className="w-full bg-green-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-green-700 transition-all">
        {loading ? "Processing..." : "Purchase"}
      </button>
    </form>
  );
}

export default PurchaseForm;
