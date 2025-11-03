import TitleSection from "../TitleSection";

import styles from "./PlanningToWatch.module.css";
import SeriesList from "./SeriesList";

const PlanningToWatch = () => {
  return (
    <section className={styles["main-section"]}>
      <TitleSection title="Planning to Watch" />
      <SeriesList pageName='planning to watch'/>
    </section>
  );
};

export default PlanningToWatch;
