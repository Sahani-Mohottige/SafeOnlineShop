import { IoLogoInstagram, IoLogoTwitter } from "react-icons/io";

import { FiPhoneCall } from "react-icons/fi";
import { Link } from "react-router-dom";
import React from "react";
import { TbBrandMeta } from "react-icons/tb";
import axios from "axios";
import notifications from "../../utils/notifications";

const Footer = () => {
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      notifications.error("Email is required", "Please enter your email address.");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/subscriber`, { email });
      notifications.success("Subscribed!", "You have successfully subscribed to our newsletter.");
      setEmail("");
    } catch (err) {
      notifications.error("Subscription Failed", err?.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-white border-t border-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Grid container */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Newsletter */}
          <div className="lg:col-span-2">
            <h3 className="text-xl font-semibold mb-4 text-gray-900">
              Newsletter
            </h3>
            <p className="mb-2 text-gray-600">
              Be the first to hear about new products, exclusive events, and
              online offers.
            </p>
            <p className="mb-6 text-gray-700 font-medium text-sm">
              Sign up and get 10% off your first order.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 w-full" onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-grow sm:w-1/2 md:w-2/3 lg:w-3/4 px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-600 transition-all"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={loading}
              />
              <button
                type="submit"
                className="w-full sm:w-auto bg-gray-900 text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-all"
                disabled={loading}
              >
                {loading ? "Subscribing..." : "Subscribe"}
              </button>
            </form>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-900">Shop</h3>
            <ul className="space-y-2 text-gray-700">
              <li>
                <Link
                  to="/collections/all?gender=Men&category=Top Wear"
                  className="hover:text-gray-900 transition-colors"
                >
                  Men's Top Wear
                </Link>
              </li>
              <li>
                <Link
                  to="/collections/all?gender=Women&category=Top Wear"
                  className="hover:text-gray-900 transition-colors"
                >
                  Women's Top Wear
                </Link>
              </li>
              <li>
                <Link
                  to="/collections/all?category=Bottom Wear&gender=Men"
                  className="hover:text-gray-900 transition-colors"
                >
                  Men's Bottom Wear
                </Link>
              </li>
              <li>
                <Link
                  to="/collections/all?category=Bottom Wear&gender=Women"
                  className="hover:text-gray-900 transition-colors"
                >
                  Women's Bottom Wear
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-900">
              Support
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li>
                <Link
                  to="/contact"
                  className="hover:text-gray-900 transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-gray-900 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/faqs"
                  className="hover:text-gray-900 transition-colors"
                >
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  to="/features"
                  className="hover:text-gray-900 transition-colors"
                >
                  Features
                </Link>
              </li>
            </ul>
          </div>

          {/* Follow Us & Contact */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-900">
              Follow Us
            </h3>
            <div className="flex items-center space-x-4 mb-4">
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500  hover:text-blue-700 transition-colors"
              >
                <TbBrandMeta className="h-6 w-6" />
              </a>
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-500 hover:text-pink-700 transition-colors"
              >
                <IoLogoInstagram className="h-6 w-6" />
              </a>
              <a
                href="https://www.twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600 transition-colors"
              >
                <IoLogoTwitter className="h-6 w-6" />
              </a>
            </div>
            <p className="text-gray-800 font-medium mb-1">Call Us</p>
            <p className="text-gray-600">
              <FiPhoneCall className="inline-block mr-2" />
              0123-456-789
            </p>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-12 border-t pt-6 text-center text-sm text-gray-600">
          © {new Date().getFullYear()}, CompileTab. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
