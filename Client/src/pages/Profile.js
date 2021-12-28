import Navbar from "../components/Navbar";
import styles from "../styles/Profile.module.css";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";

//API config
import { API } from "../config/api";

function Profile() {
  const [profile, setProfile] = useState([]);
  const [transaction, setTransaction] = useState([]);
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

  const getUser = async () => {
    try {
      const response = await API.get("/user");
      //console.log(response.data.data.user)
      setProfile(response.data.data.user);
    } catch (error) {
      console.log(error);
    }
  };

  const loadFile = function (e) {
    const image = document.getElementById("outputProfile");
    image.src = URL.createObjectURL(e.target.files[0]);
  };

  const getTransactions = async () => {
    try {
      const response = await API.get("/my-transactions");
      //console.log(response)
      const temp = response.data.data.transactions.map((item) => {
        return {
          id: item.id,
          photo: `http://localhost:5000/uploads/${item.products[0].photo}`,
          name: item.products[0].name,
          price: item.products[0].price,
          orderQuantity: item.products[0].orderQuantity,
          subtotal: item.products[0].price * item.products[0].orderQuantity,
          status: item.status,
          day: days[
            new Date(
              `${months[item.date.split("T")[0].split("-")[1] - 1]} ${
                item.date.split("T")[0].split("-")[2]
              }, ${item.date.split("T")[0].split("-")[0]}`
            ).getDay()
          ],
          date: `${item.date.split("T")[0].split("-")[2]} ${
            months[item.date.split("T")[0].split("-")[1] - 1]
          } ${item.date.split("T")[0].split("-")[0]}`,
        };
      });
      setTransaction(temp);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUser();
    getTransactions();
  }, []);

  const finishTransaction = async (dataID) => {
    try {
      //Configuration Content-type
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const status = {
        status: "success",
      };
      const body = JSON.stringify(status);

      await API.patch(`/transaction/${dataID}`, body, config);

      const currentDatas = transaction.map((item) => {
        if (item.id === dataID) {
          item.status = "success";
        }
        return item;
      });
      setTransaction(currentDatas);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className={styles.page}>
        <div className={styles.mainProfile}>
          <div className={styles.myProfile}>
            <h4>My Profile</h4>
            <div className={styles.infoPerson}>
              <div className="profilePic">
                {/* <label htmlFor="file" className="-label">
                  <span>Change Profile</span>
                  <input
                    type="file"
                    hidden
                    id="file"
                    onChange={() => loadFile()}
                  />
                </label> */}
                <img
                  className={styles.profilePhoto}
                  id="outputProfile"
                  src={profile.photo}
                  alt="Profile"
                />
              </div>
              <article>
                <h5>Full Name</h5>
                <p>{profile.fullname}</p>
                <h5>Email</h5>
                <p>{profile.email}</p>
              </article>
            </div>
          </div>
        </div>
        <div className={styles.products}>
          <h4>My Transaction</h4>
          {transaction.map((item) => {
            return (
              <div className={styles.product} key={item.id}>
                <div className={styles.detailProduct}>
                  <img
                    src={item.photo}
                    className={styles.photoProduct}
                    alt="menu pict"
                  />
                  <div className={styles.number}>
                    <p className={styles.productName}>{item.name}</p>
                    <p className={styles.date}>
                      <b>{item.day}</b>, {item.date}
                    </p>
                    <p className={styles.productPrice}>
                      Price : Rp {item.price.toLocaleString("id-ID")}
                    </p>
                    <p className={styles.productQty}>
                      Qty : {item.orderQuantity}
                    </p>
                    <p className={styles.subTotal}>
                      Sub Total : {item.subtotal.toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>
                <div className={styles.productr}>
                  <img
                    src="images/Icon.png"
                    alt="waysbeans icon"
                    className={styles.wbIcon}
                  />
                  <img
                    src="images/qrcode_success.png"
                    alt="qr"
                    className={styles.qr}
                    onClick={styles.qrClick}
                  />
                  {item.status === "success" ? (
                    <div className={styles.status}>Success</div>
                  ) : item.status === "waiting approve" ? (
                    <div className={styles.statusw}>{item.status}</div>
                  ) : item.status === "on the way" ? (
                    <button
                      className={styles.statuso}
                      onClick={() => finishTransaction(item.id)}
                    >
                      Completed
                    </button>
                  ) : (
                    <div className={styles.statusc}>Canceled</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Profile;
