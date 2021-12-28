import React, { useState, useEffect, useContext } from "react";
//React router
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserContext } from "../context/userContext";
//components
import Home from "../pages/Home";
import LandingAdmin from "../pages/LandingAdmin/LandingAdmin";
import Income from "../pages/Income";
import DetailProduct from "../pages/DetailProduct";
import Cart from "../pages/Cart";
import Shipment from "../pages/Shipment";
import Profile from "../pages/Profile";
import AddProduct from "../pages/AddProduct";
import NotFound from "../pages/NotFound/NotFound";

import { API, setAuthToken } from "../config/api";

export default function SetupRoute() {
  const { state, dispatch } = useContext(UserContext);
  const check = async () => {
    try {
      const res = await API.get("/login");
      dispatch({
        status: "login",
        payload: res.data,
      });
    } catch (err) {}
  };
  useEffect(() => {
    check();
  }, []);
  const { isLogin, user } = state;
  let isAdmin = false;
  if (user?.role === "admin") {
    isAdmin = true;
  }
  return (
    <Router>
      <Routes>
        {isLogin ? (
          <>
            <Route exact path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            {isAdmin ? (
              <>
                <Route path="/landing-admin" element={<LandingAdmin />} />
                <Route path="/income" element={<Income />} />
                <Route path="/addproduct" element={<AddProduct />} />
              </>
            ) : (
              <>
                <Route exact path="/cart" element={<Cart />} />
                <Route path="/shipment" element={<Shipment />} />
                <Route path="/product/:id" element={<DetailProduct />} />
              </>
            )}
          </>
        ) : (
          <Route exact path="/" element={<Home />} />
        )}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
