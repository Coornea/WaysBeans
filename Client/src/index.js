import React from "react";
import ReactDOM from "react-dom";
//import './styles/index.css';
import App from "./App";
import { BrowserRouter } from "react-router-dom";

import { UserContextProvider } from "./context/userContext";
import { CartContextProvider } from "./context/cartContext";

ReactDOM.render(
  <UserContextProvider>
    <CartContextProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </CartContextProvider>
  </UserContextProvider>,
  document.getElementById("root")
);
