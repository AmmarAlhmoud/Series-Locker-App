import Footer from "../Footer";
import IC_Logo from "./../../assets/icons/Layout/logo.webp";

import styles from "./Main-Layout.module.css";

const Main_Layout = (props) => {
  const findPageName = (path) => {
    return window.location.pathname.startsWith(path);
  };

  let pageName = "Home";

  if (findPageName("/add")) {
    pageName = "Add Series";
  }
  if (findPageName("/edit")) {
    pageName = "Edit Series";
  }
  if (findPageName("/watched")) {
    pageName = "Watched Series";
  }
  if (findPageName("/planning")) {
    pageName = "Planning to Watch";
  }
  if (findPageName("/new-password")) {
    pageName = "New Password";
  }
  if (findPageName("/reset-password")) {
    pageName = "Reset Password";
  }
  if (findPageName("/login")) {
    pageName = "Login";
  }
  if (findPageName("/signup")) {
    pageName = "Signup";
  }

  return (
    <main className={styles.main}>
      <section className={styles["main-sec"]}>
        <header className={styles.header}>
          <div>
            <img src={IC_Logo} alt="logo" />
            <p>WELCOME TO SERIES LOCKER</p>
          </div>
          <p>2024</p>
        </header>
        <section className={styles["sec-1"]}>
          <div className={styles["decoration-1"]} />
          <div className={styles["decoration-2"]} />
          <div className={styles["decoration-3"]} />
        </section>
        <section className={styles["sec-2"]}>
          <h1 id="HomePage">SERIES LOCKER</h1>
        </section>
        <section className={styles["sec-3"]}>
          {/* <h4>{pageName}</h4> */}
        </section>
      </section>
      <main id="starter" className={styles["children-sec"]}>
        {props.children}
        <Footer />
      </main>
    </main>
  );
};

export default Main_Layout;
