import React, { useEffect, useState } from "react";

import { Package } from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

const MyOrdersPage = () => {
  const navigate = useNavigate();
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPurchases = async () => {
      setLoading(true);
      setError("");
      try {
        if (isAuthenticated) {
          const token = await getAccessTokenSilently();
          const res = await fetch("/api/purchases", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await res.json();
          if (!res.ok) {
            setError(data.message || "Failed to fetch purchases.");
            setPurchases([]);
          } else {
            setPurchases(data);
          }
        }
      } catch (err) {
        setError("Error fetching purchases.");
        setPurchases([]);
      }
      setLoading(false);
    };
    fetchPurchases();
  }, [getAccessTokenSilently, isAuthenticated]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Package className="mx-auto h-12 w-12 text-gray-400 animate-pulse" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Loading your purchases...</h3>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="m-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Purchases</h3>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
      <div className="max-w-5xl mx-auto p-6">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-tr from-green-500 to-green-700 text-white shadow-lg">
              <Package className="w-6 h-6" />
            </span>
            <h1 className="text-3xl font-bold text-green-700 tracking-tight">My Orders</h1>
          </div>
          <p className="text-base text-gray-600">Track and manage your order history</p>
        </div>

        {purchases?.length > 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border border-green-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-green-100">
                <thead className="bg-gradient-to-r from-green-50 to-green-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-base font-bold text-green-700 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-4 text-left text-base font-bold text-green-700 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-4 text-left text-base font-bold text-green-700 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-left text-base font-bold text-green-700 uppercase tracking-wider">Delivery Time</th>
                    <th className="px-6 py-4 text-left text-base font-bold text-green-700 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-4 text-left text-base font-bold text-green-700 uppercase tracking-wider">Message</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-green-50">
                  {purchases.map((purchase) => (
                    purchase.products && purchase.products.length > 0 ? (
                      purchase.products.map((p, idx) => (
                        <tr key={purchase._id + '-' + idx} className="hover:bg-green-50 transition-colors">
                          <td className="px-6 py-4 font-semibold text-lg text-gray-900">
                            {p.name}
                            {(p.size || p.color) && (
                              <div className="text-xs text-gray-500">
                                {p.size ? `Size: ${p.size}` : ""}
                                {p.size && p.color ? <br /> : null}
                                {p.color ? `Color: ${p.color}` : ""}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 text-green-700 font-bold">{p.quantity}</td>
                          {idx === 0 && (
                            <td className="px-6 py-4 text-gray-700" rowSpan={purchase.products.length}>
                              {new Date(purchase.dateOfPurchase).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                            </td>
                          )}
                          {idx === 0 && (
                            <td className="px-6 py-4" rowSpan={purchase.products.length}>
                              <span className="inline-block bg-green-100 text-green-700 text-base font-semibold px-3 py-1 rounded-full shadow-sm">
                                {purchase.deliveryTime}
                              </span>
                            </td>
                          )}
                          {idx === 0 && (
                            <td className="px-6 py-4 text-gray-700" rowSpan={purchase.products.length}>
                              {purchase.deliveryLocation}
                            </td>
                          )}
                          {idx === 0 && (
                            <td className="px-6 py-4 text-gray-700" rowSpan={purchase.products.length}>
                              {purchase.message || <span className="text-gray-400">-</span>}
                            </td>
                          )}
                        </tr>
                      ))
                    ) : (
                      <tr key={purchase._id} className="hover:bg-green-50 transition-colors">
                        <td className="px-6 py-4 font-semibold text-lg text-gray-900"><span className="text-gray-400">-</span></td>
                        <td className="px-6 py-4 text-green-700 font-bold"><span className="text-gray-400">-</span></td>
                        <td className="px-6 py-4 text-gray-700">{new Date(purchase.dateOfPurchase).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                        <td className="px-6 py-4">
                          <span className="inline-block bg-green-100 text-green-700 text-base font-semibold px-3 py-1 rounded-full shadow-sm">
                            {purchase.deliveryTime}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-700">{purchase.deliveryLocation}</td>
                        <td className="px-6 py-4 text-gray-700">{purchase.message || <span className="text-gray-400">-</span>}</td>
                      </tr>
                    )
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-green-200 to-green-400 text-white shadow-lg mb-2">
              <Package className="w-8 h-8" />
            </span>
            <h3 className="mt-2 text-xl font-bold text-green-700">No purchases yet</h3>
            <p className="mt-1 text-base text-gray-500">Start shopping to see your purchases here.</p>
            <div className="mt-6">
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center px-5 py-2 border border-transparent shadow-sm text-base font-semibold rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Start Shopping
              </button>
            </div>
          </div>
        )}
      </div>
  );
};

export default MyOrdersPage;
