import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { appStateActions } from "../../store/app-state-slice";
import { getAuthToken } from "../../util/auth";

import IC_Menu from "./../../assets/icons/Series/menu.png";
import Button from "./../UI/Button";

import styles from "./SeriesCard.module.css";

const SeriesCard = ({ id, slug, name, country, date, url }) => {
  const [menuState, setMenuState] = useState(false);
  const [deleteSeries, setDeleteSeries] = useState(false);
  const [savedUrl, setSavedUrl] = useState(url);
  const navigate = useNavigate();

  const dipsatch = useDispatch();

  const dateString = new Date(date);

  // Format the date using the Intl.DateTimeFormat API
  const formatter = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const formattedDate = formatter.format(dateString);

  const menuHandler = () => {
    setMenuState((prev) => !prev);
  };

  const deleteSeriesHandler = () => {
    setDeleteSeries(true);
  };

  const openSeriesHandler = () => {
    window.open(url, "_blank");
  };

  const copyUrlHandler = () => {
    navigator.clipboard
      .writeText(url)
      .then(() => {
        toast.success("URL copied to clipboard!");
      })
      .catch((err) => {
        toast.error("Failed to copy URL. Please try again.");
      });
  };

  useEffect(() => {
    const jwtToken = getAuthToken();
    const deleteSeries = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:3000/api/v1/series/${id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message);
        }
        toast.success("Series deleted successfully.");
      } catch (error) {
        toast.error(error.message);
      }
    };

    if (deleteSeries !== false && menuState) {
      deleteSeries();
      setDeleteSeries(false);
      setMenuState(false);
      dipsatch(appStateActions.setRefreshData(true));
    }
  }, [deleteSeries]);

  return (
    <motion.div
      className={styles["card"]}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <motion.img
        onClick={menuHandler}
        whileHover={{ scale: 1.16 }}
        src={IC_Menu}
        alt="menu"
      />
      <div
        className={`${styles["menu-list"]} ${
          menuState ? "" : styles["hidden"]
        }`}
      >
        <motion.p onClick={deleteSeriesHandler} whileHover={{ scale: 1.1 }}>
          Delete
        </motion.p>
        <motion.p whileHover={{ scale: 1.1 }}>
          <NavLink to={`/edit-series/${slug}/${id}`}>Edit</NavLink>
        </motion.p>
      </div>
      <h2>{name}</h2>
      <p>{country} TV Series</p>
      <time dateTime={formattedDate}>{formattedDate}</time>
      <div className={styles.div}>
        <motion.button onClick={copyUrlHandler} whileHover={{ scale: 1.05 }}>
          Copy URL
        </motion.button>
        <motion.button onClick={openSeriesHandler} whileHover={{ scale: 1.05 }}>
          Open
        </motion.button>
      </div>
    </motion.div>
  );
};

export default SeriesCard;
