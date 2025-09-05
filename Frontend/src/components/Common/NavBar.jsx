import {
  HiBars3BottomRight,
  HiOutlineShoppingBag,
  HiOutlineUser,
} from "react-icons/hi2";
import React, { useState } from "react";

import CartDrawer from "../Layout/CartDrawer";
import { IoMdClose } from "react-icons/io";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import { useAuth0 } from "@auth0/auth0-react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const NavBar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const { cart } = useSelector((state) => state.cart);
  const cartItemCount =
    cart?.products?.reduce((total, product) => total + product.quantity, 0) || 0;

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const isActiveGender = (gender) => searchParams.get("gender") === gender;
  const isActiveCategory = (category) => searchParams.get("category") === category;

  const toggleNavDrawer = () => {
    setNavDrawerOpen(!navDrawerOpen);
  };

  const toggleCartDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <>
      <nav className="containter mx-auto border-b border-gray-200 flex items-center 
  justify-between py-4 px-6">
        {/*Left - Logo */}
        <div>
          <Link
            to="/"
            className="text-2xl text-green-800 font-semibold"
          >
            Pickzy
          </Link>
        </div>
        {/*Center-Navigation Links*/}
        <div className="hidden md:flex space-x-6">
          <Link
            to="/collections/all?gender=Men"
            className={`text-gray-700 hover:text-black text-xs font-medium uppercase ${isActiveGender("Men") ? "font-bold bg-green-200 py-1.5 px-3 rounded-lg" : "py-1.5 px-3"}`}
          >
            Men
          </Link>
          <Link
            to="/collections/all?gender=Women"
            className={`text-gray-700 hover:text-black text-xs font-medium uppercase ${isActiveGender("Women") ? "font-bold bg-green-200 py-1.5 px-3 rounded-lg" : "py-1.5 px-3"}`}
          >
            Women
          </Link>
          <Link
            to="/collections/all?category=Top Wear"
            className={`text-gray-700 hover:text-black text-xs font-medium uppercase ${isActiveCategory("Top Wear") ? "font-bold bg-green-200 py-1.5 px-3 rounded-lg" : "py-1.5 px-3"}`}
          >
            Top Wear
          </Link>
          <Link
            to="/collections/all?category=Bottom Wear"
            className={`text-gray-700 hover:text-black text-xs font-medium uppercase ${isActiveCategory("Bottom Wear") ? "font-bold bg-green-200 py-1.5 px-3 rounded-lg" : "py-1.5 px-3"}`}
          >
            Bottom Wear
          </Link>
        </div>
        <div>
          {/*Rright-Icons */}
          <div className="flex items-center space-x-4">
            {!isAuthenticated ? (
              <button
                onClick={() => loginWithRedirect()}
                className="bg-black text-white px-5 py-1.5 rounded-md hover:bg-gray-800 transition text-lg font-medium"
              >
                Login
              </button>
            ) : (
              <>
                <Link to="/profile" className="hover:text-black">
                  <HiOutlineUser className="h-5 w-5 text-gray-700" />
                </Link>
                <button
                  onClick={() => {
                    // Secure logout
                    localStorage.removeItem('userToken');
                    localStorage.removeItem('userInfo');
                    localStorage.removeItem('cart');
                    localStorage.removeItem('guestId');
                    sessionStorage.clear();
                    logout({ returnTo: window.location.origin });
                  }}
                  className="ml-4 bg-red-500 text-white px-3 py-1.5 rounded hover:bg-red-600 transition text-sm"
                >
                  Log Out
                </button>
              </>
            )}
            <button
              onClick={toggleCartDrawer}
              className="relative hover:text-black"
            >
              <HiOutlineShoppingBag className="h-5 w-5 text-gray-700" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 bg-green-600 text-white text-[10px] rounded-full px-1.5">
                  {cartItemCount}
                </span>
              )}
            </button>
            {/*Search */}
            <div className="overflow-hidden">
              <SearchBar />
            </div>

            <button className="md:hidden" onClick={toggleNavDrawer}>
              <HiBars3BottomRight className="h-6 w-6 text-gray-700" />
            </button>
          </div>
        </div>
      </nav>
      <CartDrawer drawerOpen={drawerOpen} toggleCartDrawer={toggleCartDrawer} />

      {/*Mobile Navigation */}
  <div
    className={`fixed top-0 text-lg bottom-0 left-0 h-full w-3/4 sm:w-1/2 md:w-1/3 bg-white border-t shadow-lg z-50 transform transition-transform duration-300 
  ${navDrawerOpen ? "translate-x-0" : "-translate-x-full"}`}
  >
        <div className="flex justify-end p-4">
          <button onClick={toggleNavDrawer}>
            <IoMdClose className="h-6 w-6 text-gray-600" />
          </button>
        </div>
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">Menu</h2>
          <nav className="space-y-3">
            <br />
            <Link
              to="/collections/all?gender=Men"
              onClick={toggleNavDrawer}
              className={`block text-gray-600 hover:text-black text-sm ${isActiveGender("Men") ? "font-bold bg-green-200 py-1.5 px-3 rounded-lg" : "py-1.5 px-3"}`}
            >
              Men
            </Link>
            <Link
              to="/collections/all?gender=Women"
              onClick={toggleNavDrawer}
              className={`block text-gray-600 hover:text-black text-sm ${isActiveGender("Women") ? "font-bold bg-green-200 py-1.5 px-3 rounded-lg" : "py-1.5 px-3"}`}
            >
              Women
            </Link>
            <Link
              to="/collections/all?category=Top Wear"
              onClick={toggleNavDrawer}
              className={`block text-gray-600 hover:text-black text-sm ${isActiveCategory("Top Wear") ? "font-bold bg-green-200 py-1.5 px-3 rounded-lg" : "py-1.5 px-3"}`}
            >
              Top Wear
            </Link>
            <Link
              to="/collections/all?category=Bottom Wear"
              onClick={toggleNavDrawer}
              className={`block text-gray-600 hover:text-black text-sm ${isActiveCategory("Bottom Wear") ? "font-bold bg-green-200 py-1.5 px-3 rounded-lg" : "py-1.5 px-3"}`}
            >
              Bottom Wear
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
};

export default NavBar;
