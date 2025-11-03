import React from "react";
import { NavLink } from "react-router-dom";

import NavBtn from "./UI/NavBtn";

import styles from "./Error.module.css";

const Error = () => {
  return (
    <main className={styles.main}>
      <h1 className={styles.h1}>404</h1>
      <p className={styles.p}>
        The page you are looking for doesn't exist or has been moved. Please go
        back to the Home page.
      </p>
      <NavBtn className={styles.btn} navError={true} to="/">
        Go Back Home
      </NavBtn>
    </main>
  );
};

export default Error;
