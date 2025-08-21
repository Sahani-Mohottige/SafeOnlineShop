import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import PayPalButton from "./PayPalButton";
import { fetchCart, clearCart, clearCartServer } from "../../redux/slices/cartSlice";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Get the cart state - the actual cart data is in cartState.cart
  const cartState = useSelector((state) => state.cart);
  const { cart, loading, error } = cartState;
  
  // Extract cart items and total from the cart object
  const actualCartItems = cart?.products || [];
  const actualTotalAmount = cart?.totalPrice;
  
  const { user, guestId } = useSelector((state) => state.auth);

  const [checkoutId, setCheckoutId] = useState(null);
  const [paymentError, setPaymentError] = useState("");
  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmissionTime, setLastSubmissionTime] = useState(0);

  useEffect(() => {
    const userId = user ? user._id : null;
    console.log("Fetching cart with:", { userId, guestId });
    if (userId || guestId) {
      dispatch(fetchCart({ userId, guestId }));
    }
  }, [dispatch, user, guestId]);

  // Security: Input sanitization function
  const sanitizeInput = (input) => {
    if (typeof input !== 'string') return '';
    return input
      .trim()
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
      .replace(/[<>]/g, '') // Remove < and > characters
      .slice(0, 100); // Limit length
  };

  // Security: Form validation with security checks
  const validateForm = () => {
    const errors = {};
    const { firstName, lastName, address, city, postalCode, country, phone } = shippingAddress;

    // Validate required fields
    if (!firstName.trim()) errors.firstName = 'First name is required';
    if (!lastName.trim()) errors.lastName = 'Last name is required';
    if (!address.trim()) errors.address = 'Address is required';
    if (!city.trim()) errors.city = 'City is required';
    if (!postalCode.trim()) errors.postalCode = 'Postal code is required';
    if (!country.trim()) errors.country = 'Country is required';
    if (!phone.trim()) errors.phone = 'Phone number is required';

    // Security: Check for suspicious patterns
    const suspiciousPatterns = [
      /script/i, /javascript/i, /vbscript/i, /onload/i, /onerror/i,
      /eval\(/i, /function\(/i, /alert\(/i, /document\./i, /window\./i
    ];

    Object.values(shippingAddress).forEach(value => {
      if (typeof value === 'string') {
        suspiciousPatterns.forEach(pattern => {
          if (pattern.test(value)) {
            errors.security = 'Invalid characters detected in form data';
          }
        });
      }
    });

    // Validate postal code format (basic)
    if (postalCode && !/^[a-zA-Z0-9\s-]{3,10}$/.test(postalCode)) {
      errors.postalCode = 'Invalid postal code format';
    }

    // Validate phone number format - exactly 10 digits
    if (phone && !/^\d{10}$/.test(phone)) {
      errors.phone = 'Phone number must be exactly 10 digits';
    }

    // Validate name fields (no numbers or special chars)
    if (firstName && !/^[a-zA-Z\s]{1,50}$/.test(firstName)) {
      errors.firstName = 'First name should only contain letters';
    }
    if (lastName && !/^[a-zA-Z\s]{1,50}$/.test(lastName)) {
      errors.lastName = 'Last name should only contain letters';
    }

    return errors;
  };

  // Security: Rate limiting check
  const isRateLimited = () => {
    const now = Date.now();
    const timeSinceLastSubmission = now - lastSubmissionTime;
    return timeSinceLastSubmission < 2000; // 2 second minimum between submissions
  };

  // Secure input handler with sanitization
  const handleInputChange = (field, value) => {
    let sanitizedValue = sanitizeInput(value);
    
    // Special handling for phone number - only allow digits
    if (field === 'phone') {
      sanitizedValue = value.replace(/\D/g, '').slice(0, 10); // Remove non-digits and limit to 10
    }
    
    setShippingAddress(prev => ({
      ...prev,
      [field]: sanitizedValue
    }));
    
    // Clear specific field error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleCreateCheckout = async (e) => {
    e.preventDefault();
    
    // Security checks
    if (isSubmitting) return;
    if (isRateLimited()) {
      setPaymentError('Please wait before submitting again');
      return;
    }

    setIsSubmitting(true);
    setFormErrors({});
    setPaymentError('');

    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setIsSubmitting(false);
      return;
    }

    // Security: Log submission attempt (for monitoring)
    console.log('Secure checkout submission at:', new Date().toISOString());
    
    try {
      setLastSubmissionTime(Date.now());
      setCheckoutId("123");
    } catch (error) {
      console.error('Checkout creation error:', error);
      setPaymentError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentSuccess = (details) => {
    console.log("Payment Successful.", details);
    // Clear the cart on server for logged-in users and locally
    const userId = user ? user._id : null;
    dispatch(clearCartServer({ userId, guestId }));
    dispatch(clearCart());
    navigate("/order-confirmation");
  };

  const handlePaymentError = (err) => {
    // ✅ Better error handling
    console.error("Payment error:", err);
    setPaymentError(
      "Payment failed. Please try again or use a different payment method.",
    );
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-10 px-6">
        <div className="text-center">Loading checkout...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto py-10 px-6">
        <div className="text-center text-red-600">
          Error loading cart: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-6xl mx-auto py-10 px-6">
      {/* Left Section */}
      <div>
        <h2 className="text-3xl font-bold mb-6">Checkout</h2>

        {paymentError && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {paymentError}
          </div>
        )}

        {/* Security Error Display */}
        {formErrors.security && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            <strong>Security Alert:</strong> {formErrors.security}
          </div>
        )}

        <form onSubmit={handleCreateCheckout} className="space-y-6" noValidate>
          <div>
            <h3 className="text-xl font-semibold mb-2">Contact Details</h3>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={user?.email || "guest@example.com"}
              className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed text-gray-500"
              disabled
            />
            <p className="text-xs text-gray-500 mt-1">
              {user ? "Using your registered email address" : "Login to use your registered email"}
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Delivery</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">First Name *</label>
                <input
                  type="text"
                  className={`w-full p-2 border rounded ${formErrors.firstName ? 'border-red-500' : ''}`}
                  value={shippingAddress.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  maxLength="50"
                  autoComplete="given-name"
                  required
                />
                {formErrors.firstName && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.firstName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Last Name *</label>
                <input
                  type="text"
                  className={`w-full p-2 border rounded ${formErrors.lastName ? 'border-red-500' : ''}`}
                  value={shippingAddress.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  maxLength="50"
                  autoComplete="family-name"
                  required
                />
                {formErrors.lastName && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.lastName}</p>
                )}
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium mb-1">Address *</label>
              <input
                type="text"
                className={`w-full p-2 border rounded ${formErrors.address ? 'border-red-500' : ''}`}
                value={shippingAddress.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                maxLength="100"
                autoComplete="street-address"
                required
              />
              {formErrors.address && (
                <p className="text-red-500 text-xs mt-1">{formErrors.address}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium mb-1">City *</label>
                <input
                  type="text"
                  className={`w-full p-2 border rounded ${formErrors.city ? 'border-red-500' : ''}`}
                  value={shippingAddress.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  maxLength="50"
                  autoComplete="address-level2"
                  required
                />
                {formErrors.city && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.city}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Postal Code *</label>
                <input
                  type="text"
                  className={`w-full p-2 border rounded ${formErrors.postalCode ? 'border-red-500' : ''}`}
                  value={shippingAddress.postalCode}
                  onChange={(e) => handleInputChange('postalCode', e.target.value)}
                  maxLength="10"
                  autoComplete="postal-code"
                  required
                />
                {formErrors.postalCode && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.postalCode}</p>
                )}
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium mb-1">Country *</label>
              <input
                type="text"
                className={`w-full p-2 border rounded ${formErrors.country ? 'border-red-500' : ''}`}
                value={shippingAddress.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                maxLength="50"
                autoComplete="country-name"
                required
              />
              {formErrors.country && (
                <p className="text-red-500 text-xs mt-1">{formErrors.country}</p>
              )}
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium mb-1">Phone Number *</label>
              <input
                type="tel"
                className={`w-full p-2 border rounded ${formErrors.phone ? 'border-red-500' : ''}`}
                value={shippingAddress.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                maxLength="10"
                placeholder="1234567890"
                autoComplete="tel"
                required
              />
              {formErrors.phone && (
                <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">Enter 10 digits only</p>
            </div>

            <div className="mt-6">
              {!checkoutId ? (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-2 px-4 rounded transition ${
                    isSubmitting 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gray-900 hover:bg-gray-700'
                  } text-white`}
                >
                  {isSubmitting ? 'Processing...' : 'Continue to Payment'}
                </button>
              ) : (
                <div className="p-4 border rounded bg-white shadow">
                  <h3 className="text-lg font-semibold text-green-600 mb-2">
                    Pay with PayPal
                  </h3>
                  <p className="text-sm mb-6 text-gray-600">
                    Redirecting to PayPal for payment...
                  </p>
                  <PayPalButton
                    amount={actualTotalAmount}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                  />
                </div>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* Right Section */}
      <div className="bg-blue-50 p-6 rounded-lg shadow-sm">
        <h3 className="text-xl font-semibold mb-4">Order Summary</h3>

        {actualCartItems && Array.isArray(actualCartItems) && actualCartItems.length > 0 ? (
          actualCartItems.map((item, index) => (
            <div
              key={item._id || item.productId || index}
              className="flex items-start justify-between py-2 border-t border-blue-300"
            >
              <div className="flex items-start">
                <img
                  src={item.image || "https://via.placeholder.com/80x80?text=No+Image"}
                  alt={item.name || "Product"}
                  className="w-20 h-20 rounded object-cover"
                />
              </div>
              <div>
                <h3 className="text-md">{item.name}</h3>
                <p className="text-gray-600">Size: {item.size}</p>
                <p className="text-gray-600">Color: {item.color}</p>
                <p className="text-gray-600">Qty: {item.quantity}</p>
              </div>
              <div>
                <p className="font-bold">
                  ${(item.price * item.quantity)?.toLocaleString()}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">
              {loading ? "Loading cart..." : "Your cart is empty"}
            </p>
          </div>
        )}

        <hr className="my-4 border-gray-500" />
        <div className="flex justify-between items-center text-lg mb-4">
          <p>Subtotal:</p>
          <p>${actualTotalAmount?.toLocaleString()}</p>
        </div>

        <div className="flex justify-between items-center text-lg mb-4">
          <p>Shipping</p>
          <p>Free</p>
        </div>
        <div className="flex justify-between items-center text-lg font-bold mb-4">
          <p>Total:</p>
          <p className="font-bold text-xl">
            ${actualTotalAmount?.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
