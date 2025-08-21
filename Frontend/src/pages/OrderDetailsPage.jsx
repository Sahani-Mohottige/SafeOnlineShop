import { ArrowLeft, CreditCard, MapPin, Package, Truck } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchOrderDetails } from "../redux/slices/orderSlice";

const OrderDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { orderDetails, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    if (id) {
      dispatch(fetchOrderDetails(id));
    }
  }, [dispatch, id]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Package className="mx-auto h-12 w-12 text-gray-400 animate-pulse" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Loading order details...</h3>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Order</h3>
          <p className="text-red-600">{error}</p>
          <div className="mt-4 space-x-4">
            <button
              onClick={() => dispatch(fetchOrderDetails(id))}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
            <Link 
              to="/my-orders"
              className="inline-flex items-center text-blue-600 hover:text-blue-800"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Order not found</h3>
          <p className="mt-1 text-sm text-gray-500">
            The order you're looking for doesn't exist or has been removed.
          </p>
          <div className="mt-6">
            <Link 
              to="/my-orders"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <Link 
          to="/my-orders" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Orders
        </Link>
        <h1 className="text-3xl font-semibold text-slate-800">
          Order Details
        </h1>
        <p className="text-gray-600 mt-1">
          Order #{orderDetails._id?.slice(-8) || 'N/A'} • {formatDate(orderDetails.createdAt)}
        </p>
      </div>

      {/* Order Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Payment Status */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center">
            <div className={`p-3 rounded-full ${orderDetails.isPaid ? 'bg-green-100' : 'bg-red-100'}`}>
              <CreditCard className={`w-6 h-6 ${orderDetails.isPaid ? 'text-green-600' : 'text-red-600'}`} />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Payment Status</h3>
              <p className={`text-sm font-medium ${orderDetails.isPaid ? 'text-green-600' : 'text-red-600'}`}>
                {orderDetails.isPaid ? 'Payment Confirmed' : 'Payment Pending'}
              </p>
              <p className="text-sm text-gray-500">
                Method: {orderDetails.paymentMethod || 'Not specified'}
              </p>
            </div>
          </div>
        </div>

        {/* Delivery Status */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center">
            <div className={`p-3 rounded-full ${orderDetails.isDelivered ? 'bg-green-100' : 'bg-yellow-100'}`}>
              <Truck className={`w-6 h-6 ${orderDetails.isDelivered ? 'text-green-600' : 'text-yellow-600'}`} />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Delivery Status</h3>
              <p className={`text-sm font-medium ${orderDetails.isDelivered ? 'text-green-600' : 'text-yellow-600'}`}>
                {orderDetails.isDelivered ? 'Delivered' : 'In Transit'}
              </p>
              <p className="text-sm text-gray-500">
                Method: {orderDetails.shippingMethod || 'Standard Shipping'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="bg-white rounded-lg border p-6 mb-8">
        <div className="flex items-center mb-4">
          <MapPin className="w-5 h-5 text-gray-400 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Shipping Address</h3>
        </div>
        {orderDetails.shippingAddress ? (
          <div className="text-gray-600">
            <p>{orderDetails.shippingAddress.address || 'Address not specified'}</p>
            <p>{orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.country}</p>
            {orderDetails.shippingAddress.postalCode && (
              <p>{orderDetails.shippingAddress.postalCode}</p>
            )}
          </div>
        ) : (
          <p className="text-gray-500">Shipping address not available</p>
        )}
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Order Items</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orderDetails.orderItems?.map((item, index) => (
                <tr key={item.productId || index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-16 w-16">
                        {item.image || item.images?.[0] ? (
                          <img
                            src={item.image || item.images[0]}
                            alt={item.name}
                            className="h-16 w-16 object-cover rounded-lg"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/64x64?text=No+Image';
                            }}
                          />
                        ) : (
                          <div className="h-16 w-16 bg-gray-200 rounded-lg flex items-center justify-center">
                            <Package className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {item.name || 'Product name not available'}
                        </div>
                        {item.size && item.color && (
                          <div className="text-sm text-gray-500">
                            Size: {item.size} • Color: {item.color}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(item.price || 0)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.quantity || 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency((item.price || 0) * (item.quantity || 1))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Order Total */}
        <div className="bg-gray-50 px-6 py-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium text-gray-900">Total</span>
            <span className="text-xl font-bold text-gray-900">
              {formatCurrency(orderDetails.totalPrice || 0)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
