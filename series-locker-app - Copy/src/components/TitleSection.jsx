import styles from "./TitleSection.module.css";

const TitleSection = ({ title, content }) => {
  return (
    <section
      className={`${styles["main-section"]} ${content ? "" : styles.noContent}`}
    >
      <h2>{title}</h2>
      {content && (
        <div>
          <p>{content}</p>
          <p className={styles.p}>
            ████ ███ █████ █ ██ █ ███ █ ███ ███ ███ █ ███ ██ █████ ███ ██ ███ █
            █████ █████ █ ██ ██ ███ ██
          </p>
        </div>
      )}
    </section>
  );
};

export default TitleSection;
