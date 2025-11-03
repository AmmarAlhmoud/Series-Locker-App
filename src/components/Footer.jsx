import { NavLink, Form, useRouteLoaderData } from "react-router-dom";

import IC_Logo from "./../assets/icons/Layout/logo.webp";

import styles from "./Footer.module.css";
import { useSelector } from "react-redux";

const Footer = () => {
  const year = new Date().getFullYear();
  const token = useRouteLoaderData("root");
  return (
    <footer className={styles["footer-section"]}>
      <div>
        <nav>
          <img src={IC_Logo} alt="Logo" />
          <ul>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/add-series">Add Series</NavLink>
            <NavLink to="/planning-to-watch">Planning to Watch</NavLink>
            <NavLink to="/watched-series">Watched Series</NavLink>
          </ul>
        </nav>
        {token && (
          <Form action="/logout" method="POST">
            <button className={styles.logout}>Logout</button>
          </Form>
        )}
        {!token && (
          <div className={styles["action-buttons"]}>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/signup">Signup</NavLink>
          </div>
        )}
      </div>
      <p className={styles["copyrigth"]}>
        © {year} Series Locker. All Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;
