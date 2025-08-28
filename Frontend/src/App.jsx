import { BrowserRouter, Route, Routes } from "react-router-dom";

import Checkout from "./components/Cart/Checkout";
import CollectionPage from "./pages/CollectionPage";
import Home from "./pages/Home";
import Login from "./pages/Login";
import MyOrdersPage from "./pages/MyOrdersPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import ProductDetails from "./components/Products/ProductDetails";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import {Provider} from "react-redux";
import React from "react";
import Register from "./pages/Register";
import ScrollToTop from "./components/ScrollToTop";
import SearchResults from "./components/Common/SearchResults";
import { Toaster } from "sonner";
import UserLayout from "./components/Layout/UserLayout";
import store from "./redux/store";

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Toaster 
          position="top-right" 
          richColors
          expand={true}
          duration={4000}
          toastOptions={{
            style: {
              background: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              fontSize: '14px',
              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
              padding: '16px',
              minHeight: '60px',
            },
            className: 'toast-custom',
          }}
        />
        <ScrollToTop />
        <Routes>
        {/*User Layout*/}
        <Route path="/" element={<UserLayout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="collections/:collection" element={<CollectionPage />} />
          <Route path="product/:id" element={<ProductDetails />} />
          <Route path="checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="order-confirmation" element={<ProtectedRoute><OrderConfirmationPage /></ProtectedRoute>} />
          <Route path="order/:id" element={<ProtectedRoute><OrderDetailsPage /></ProtectedRoute>} />
          <Route path="my-orders" element={<ProtectedRoute><MyOrdersPage /></ProtectedRoute>} />
          <Route path="search" element={<SearchResults />} />
       </Route>
      </Routes>
    </BrowserRouter>
  </Provider>
);
};

export default App;
