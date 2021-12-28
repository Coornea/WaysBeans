import React from "react";

import Navbar from "../../components/Navbar";
import styles from "./NotFound.module.css";
import notfound from "./404.png";

export default function NotFound() {
  return (
    <div>
      <Navbar />
      <div className={styles.content}>
        <img
          className={styles.imgNotFound}
          src={notfound}
          alt="404error Page Not Found"
        />
      </div>
      <a
        className={styles.freepik}
        href="https://www.freepik.com/vectors/website"
      >
        Website vector created by stories - www.freepik.com
      </a>
    </div>
  );
}
