import Navbar from "../components/Navbar";
import styles from "../styles/Shipment.module.css";
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "react-bootstrap";

import { CartContext } from "../context/cartContext";

//API config
import { API } from "../config/api";

function Shipment() {
  let navigate = useNavigate();
  const [mod, setMod] = useState(false);
  const [orderedMenus, setOrderedMenus] = useContext(CartContext);
  const [preview, setPreview] = useState(null);
  const [today, setToday] = useState(null);
  const [date, setDate] = useState(null);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    attachment: "",
  });
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.type === "file" ? e.target.files : e.target.value,
    });

    if (e.target.type === "file") {
      let url = URL.createObjectURL(e.target.files[0]);
      setPreview(url);
    }
  };
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const config = {
        headers: {
          "Content-type": "multipart/form-data",
        },
      };
      const product = orderedMenus.products.map((item) => {
        return {
          id: item.id,
          orderQuantity: item.orderQuantity,
        };
      });
      const formData = new FormData();
      formData.set("attachment", form.attachment[0], form.attachment[0].name);
      formData.set("name", form.name);
      formData.set("email", form.email);
      formData.set("phone", form.phone);
      formData.set("address", form.address);
      formData.set("product", JSON.stringify(product));

      await API.post("/transaction", formData, config);
      setOrderedMenus({
        type: "EMPTY_CART",
      });
      handMod();
    } catch (error) {
      console.log(error);
    }
  };

  const handModClose = () => {
    setMod(false);
    navigate("/profile");
  };
  const handMod = () => setMod(true);

  const getDate = () => {
    const today = new Date();
    const date = today.getDate();
    const month = today.getMonth();
    const year = today.getFullYear();
    const day = today.getDay();

    setToday(days[day]);
    setDate(`${date} ${months[month]} ${year}`);
  };

  useEffect(() => {
    getDate();
  }, []);

  return (
    <div>
      <Navbar />
      <div className={styles.Shipment}>
        <div className={styles.ShipmentL}>
          <h4>Shipping</h4>
          <form className={styles.ShipmentForm} onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Name"
              className={styles.inputName}
              onChange={handleChange}
              name="name"
            />
            <input
              type="email"
              placeholder="Email"
              className={styles.inputEmail}
              defaultValue={form.email}
              onChange={handleChange}
              name="email"
            />
            <input
              type="tel"
              placeholder="Phone"
              className={styles.inputPhone}
              defaultValue={form.phone}
              onChange={handleChange}
              name="phone"
            />
            <textarea
              placeholder="Address"
              className={styles.inputAddress}
              defaultValue={form.address}
              onChange={handleChange}
              name="address"
            />
            <div className={styles.attachment}>
              <label htmlFor="file" className={styles.inputFile}>
                Attach Image
                <img src="./images/attachFile.png" alt="" />
              </label>
              <input
                type="file"
                hidden
                id="file"
                name="attachment"
                onChange={handleChange}
                aria-label="File browser example"
              />
              <div id="preview" className={styles.preview}>
                {preview ? (
                  <>
                    <img
                      src={preview}
                      alt="Preview"
                      style={{
                        width: "450px",
                        height: "100%",
                      }}
                    />
                  </>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </form>
        </div>
        <div className={styles.products}>
          {orderedMenus.products.map((item) => {
            return (
              <div className={styles.product} key={item.id}>
                <div className={styles.detailProduct}>
                  <img src={item.photo} alt="menu pict" />
                  <div className={styles.number}>
                    <p className={styles.productName}>{item.name}</p>
                    <p className={styles.date}>
                      <b>{today}</b>, {date}
                    </p>
                    <p className={styles.productPrice}>
                      Price : Rp {item.price.toLocaleString("id-ID")}
                    </p>
                    <p className={styles.productQty}>
                      Qty : {item.orderQuantity}
                    </p>
                    <p className={styles.subTotal}>
                      Sub Total :{" "}
                      {(item.price * item.orderQuantity).toLocaleString(
                        "id-ID"
                      )}
                    </p>
                  </div>
                </div>
                <img
                  src="images/Icon.png"
                  alt="waysbeans Icon"
                  className={styles.wbIcon}
                />
              </div>
            );
          })}
          {orderedMenus.subtotal !== 0 ? (
            <button onClick={handleSubmit}>Pay</button>
          ) : (
            <></>
          )}
        </div>
        <Modal
          show={mod}
          onHide={handModClose}
          size="lg"
          centered
          style={{ display: "flex", justifyContent: "center" }}
        >
          <Modal.Body className={styles.modalBody}>
            <div className={styles.popup}>
              <p className={styles.popText}>
                Thank you for ordering, please wait 1 x 24 hours
              </p>
              <p className={styles.popText}>to verify your order</p>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
}

export default Shipment;
