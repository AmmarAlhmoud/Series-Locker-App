import { useRouteLoaderData } from "react-router-dom";

import NavBtn from "./UI/NavBtn";

import styles from "./Suggestion.module.css";

const Suggestion = ({ title, btnTitle, to }) => {
  const token = useRouteLoaderData("root");
  return (
    <>
      {token && <div className={styles["suggestion-section"]}></div>}
      {!token && (
        <section className={styles["suggestion-section"]}>
          <h2>{title}</h2>
          <NavBtn to={to}>{btnTitle}</NavBtn>
        </section>
      )}
    </>
  );
};

export default Suggestion;
