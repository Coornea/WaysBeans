import Navbar from "../components/Navbar";
import React, { useState, useEffect, useContext } from "react";
import styles from "../styles/DetailProduct.module.css";
//import { Dropdown, NavDropdown } from 'react-bootstrap';
import { useParams } from "react-router-dom";

import { CartContext } from "../context/cartContext";

//API config
import { API } from "../config/api";

function RestaurantMenu() {
  const [product, setProduct] = useState({ photo: "dadadad", price: 0 });
  const [orderedMenus, setOrderedMenus] = useContext(CartContext);
  const { productId } = useParams();

  const getProduct = async () => {
    try {
      const response = await API.get(`/product/${productId}`);
      console.log(response.data.data.product);
      setProduct(response.data.data.product);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProduct();
  }, []);

  let available = false;
  const addorder = (product) => {
    const order = orderedMenus.products.map((elem) => {
      if (elem.id === product.id) {
        elem.orderQuantity = elem.orderQuantity + 1;
        available = true;
      }
      return elem;
    });
    let total = parseInt(orderedMenus.subtotal) + 1;
    if (!available) {
      order.push({
        id: product.id,
        orderQuantity: 1,
        name: product.name,
        price: product.price,
        photo: product.photo,
      });
      setOrderedMenus({
        type: "ADD_CART",
        payload: order,
        total,
      });
    } else {
      setOrderedMenus({
        type: "ADD_CART",
        payload: order,
        total,
      });
    }
  };

  return (
    <div className={styles.Restaurant}>
      <Navbar />
      <div className={styles.product}>
        <img
          src={product?.photo}
          alt="menu pict"
          className={styles.productImage}
        />
        <div className={styles.desc}>
          <p className={styles.productName}>{product?.name}</p>
          <p className={styles.productStock}>Stock : {product?.stock}</p>
          <p className={styles.productDesc}>{product?.description}</p>
          <p className={styles.productPrice}>
            Rp {product?.price.toLocaleString("id-ID")}
          </p>
          <button
            className={styles.productBTN}
            onClick={() => addorder(product)}
          >
            Add Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default RestaurantMenu;
