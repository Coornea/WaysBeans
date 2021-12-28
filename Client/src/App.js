import "./styles/App.css";

import React, { useContext, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { UserContext } from "./context/userContext";

import Home from "./pages/Home";
import LandingAdmin from "./pages/LandingAdmin/LandingAdmin";
import Income from "./pages/Income";
import DetailProduct from "./pages/DetailProduct";
import Cart from "./pages/Cart";
import Shipment from "./pages/Shipment";
import Profile from "./pages/Profile";
import AddProduct from "./pages/AddProduct";
import NotFound from "./pages/NotFound/NotFound";

// Get API config & setAuthToken
import { API, setAuthToken } from "./config/api";
// import PrivateRoute from "./routes/PrivateRoute";

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

export default function App() {
  const [state, dispatch] = useContext(UserContext);

  const checkUser = async () => {
    try {
      const response = await API.get("/user");

      if (response.status === 404) {
        return dispatch({
          type: "AUTH_ERROR",
        });
      }

      let payload = response.data.data.user;

      payload.token = localStorage.token;

      dispatch({
        type: "USER_SUCCESS",
        payload,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  return (
    <Routes>
      <Route exact path="/" element={<Home />} />
      <Route path="/landing-admin" element={<LandingAdmin />} />
      <Route path="/income" element={<Income />} />
      <Route path="detailproduct/:productId" element={<DetailProduct />} />
      <Route path="cart" element={<Cart />} />
      <Route path="shipment" element={<Shipment />} />
      <Route path="profile" element={<Profile />} />
      <Route path="addproduct" element={<AddProduct />} />
      <Route path="/error" element={<NotFound />} />
      <Route path="*" element={<Navigate to={"/error"} />} />
    </Routes>
  );
}
