import React from "react";

import styles from "./LandingAdmin.module.css";
import Navbar from "../../components/Navbar";

export default function LandingAdmin() {
  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.content}>
          <h2 className={styles.title}>Welcome Admin</h2>
          <div className={styles.cardContainer}>
            <div className={styles.cardMenus}>
              <img
                className={styles.imgCard}
                src="./images/credit-card.png"
                alt="Income Transaction"
              />
              <a href="/income">
                <button className={styles.btnCard}>Income Transaction</button>
              </a>
            </div>
            <div className={styles.cardMenus}>
              <img
                className={styles.imgCard}
                src="./images/notes.png"
                alt="images"
              />
              <a href="/addproduct">
                <button className={styles.btnCard}>Add Product</button>
              </a>
            </div>
            <div className={styles.cardMenus}>
              <img
                className={styles.imgCard}
                src="./images/cv.png"
                alt="images"
              />
              <a href="/profile">
                <button className={styles.btnCard}>Go to Profile</button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
