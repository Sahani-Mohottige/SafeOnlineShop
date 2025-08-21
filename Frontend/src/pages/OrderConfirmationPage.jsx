import React from "react";

const checkout = {
  _id: "1234",
  createdAt: new Date(),
  checkoutItems: [
    {
      productId: "1",
      size: "M",
      color: "Black",
      name: "Stylish Jacket",
      price: 100,
      quantity: 1,
      images: "https://picsum.photos/500/500?random=1",
    },
    {
      productId: "2",
      size: "L",
      color: "Red",
      name: "Casual Jacket",
      price: 100,
      quantity: 1,
      images: "https://picsum.photos/500/500?random=2",
    },
  ],
  shippingAddress: {
    address: "123 Fashion street",
    city: "New York",
    country: "USA",
  },
};

const OrderConfirmationPage = () => {
  const calculateEstimateDelivery = (createdAt) => {
    const orderDate = new Date(createdAt);
    orderDate.setDate(orderDate.getDate() + 10); //add 10 days to order date
    return orderDate.toLocaleDateString();
  };
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-4xl font-bold text-center text-emerald-700 mb-8">
        Thank You for Your Order!
      </h1>

      {checkout && (
        <div className="space-y-6">
          <div className="border-b pb-4 grid grid-cols-2">
            {/*Order Id and Date */}
            <div className="mb-2 text-gray-700 ">
              <h2 className="text-lg font-semibold">
                Order ID: {checkout._id}
              </h2>
              <p className="text-lg">
                Order Date: {new Date(checkout.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="text-sm text-gray-600">
              {/*Estimated Delivery */}
              <p className="text-emerald-700">
                Estimated Delivery: {""}
                {calculateEstimateDelivery(checkout.createdAt)}
              </p>
            </div>
          </div>
          {/*Ordered Item */}
          <div className="space-y-4">
            {checkout.checkoutItems.map((item) => {
              return (
                <div
                  key={item.productId}
                  className="flex items-center mb-4 p-4 rounded-md shadow-sm"
                >
                  <img
                    src={item.images}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-md mr-4"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-gray-600">
                      {item.color} | {item.size}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">${item.price}</p>
                    <p className="text-sm text-gray-600">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          {/*Payment and Delivery Info*/}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-2 gap-8 pt-4">
            <div>
              <h4 className="font-semibold text-lg mb-2">Payment</h4>
              <p className="text-gray-700">PayPal</p>
            </div>
            {/*Delivery Info*/}
            <div>
              <h4 className="font-semibold text-lg mb-1">Delivery</h4>
              <p className="text-gray-700">
                {checkout.shippingAddress.address}
              </p>
              <p className="text-gray-700">
                {checkout.shippingAddress.city},{" "}
                {checkout.shippingAddress.country}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderConfirmationPage;
