import TitleSection from "../TitleSection";

import styles from "./WatchedSeries.module.css";
import SeriesList from "./SeriesList";

const WatchedSeries = () => {
  return (
    <section className={styles["main-section"]}>
      <TitleSection title="Watched Series" />
      <SeriesList pageName="watched" />
    </section>
  );
};

export default WatchedSeries;
