import { useEffect } from "react";
import TitleSection from "./../TitleSection";
import NavItem from "./navItem";
import Suggestion from "./../Suggestion";

import IMG_Add_Series from "./../../assets/icons/Home/add_series.webp";
import IMG_Planning_To_Watch from "./../../assets/icons/Home/planning_to_watch.webp";
import IMG_Watched_Series from "./../../assets/icons/Home/watched_series.webp";

import styles from "./Home.module.css";
import Footer from "../Footer";

const Home = () => {

  useEffect(() => {
    window.scrollTo(0, document.getElementById("HomePage").offsetTop);
  }, []);

  return (
    <section className={styles["main-section"]}>
      <TitleSection
        title="Unleash Your Series Self"
        content="Series Locker allows you to dive in the world of mesmerizing series. Lose yourself in a labyrinth of Imazing series's"
      />
      <section className={styles["navigation-section"]}>
        <ul>
          <NavItem to="/add-series" title={"Add Series"} src={IMG_Add_Series} />
          <NavItem
            to="/planning-to-watch"
            title={"Planning to Watch"}
            src={IMG_Planning_To_Watch}
          />
          <NavItem
            to="/watched-series"
            title={"Watched Series"}
            src={IMG_Watched_Series}
          />
        </ul>
      </section>
      <Suggestion
        to="/signup"
        title={"Signup to Start Using Series Locker."}
        btnTitle={"Get Started"}
      />
    </section>
  );
};

export default Home;
