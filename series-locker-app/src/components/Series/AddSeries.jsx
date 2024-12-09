import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import { countryList, watchingTypeList } from "./../../util/SelectionLists";
import { appStateActions } from "../../store/app-state-slice";
import validator from "validator";
import { format } from "date-fns";
import { toast } from "sonner";
import { getAuthToken } from "./../../util/auth";

import TitleSection from "../TitleSection";
import Input from "../UI/Input";
import Button from "../UI/Button";
import Dropdown from "../UI/dropdown";
import BarLoader from "../UI/BarLoader";

import styles from "./AddSeries.module.css";

const AddSeries = () => {
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dateColor, setDateColor] = useState(false);
  const [watched, setWatched] = useState(false);
  const [planningToWatch, setPlanningToWatch] = useState(false);

  const selectedCountry = useSelector(
    (state) => state.appState.selectedCountry
  );
  const selectedWatchingType = useSelector(
    (state) => state.appState.selectedWatchingType
  );
  const newSeriesData = useSelector((state) => state.appState.newSeriesData);
  const seriesNameRef = useRef();
  const urlRef = useRef();
  const dateOfWatchingRef = useRef();
  const dateOfAddingRef = useRef();
  const today = new Date();
  const formattedDate = format(today, "yyyy-MM-dd");

  const dateOfWatchingChangeHandler = () => {
    setDateColor(true);
  };

  const CheckIfInputEmpty = (input) => {
    return input?.value === "";
  };

  const capitalizeWords = (str) => {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const isValidUrl = (urlString) => {
    // const urlPattern =
    //   /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    return validator.isURL(urlString);
  };

  const addSeriesHandler = (event) => {
    event.preventDefault();

    const formData = {};
    if (
      CheckIfInputEmpty(seriesNameRef.current) ||
      CheckIfInputEmpty(urlRef.current) ||
      selectedCountry?.value === undefined ||
      selectedWatchingType?.value === undefined
    ) {
      toast.error("Please make sure all fields are filled");
      return;
    } else {
      if (isValidUrl(urlRef.current.value)) {
        formData.url = urlRef.current.value.trim();
      } else {
        toast.error("Please make sure you have entered a valid url");
        return;
      }
      formData.name = capitalizeWords(seriesNameRef.current.value.trim());
      formData.country = selectedCountry.label;
      formData.watchingType = selectedWatchingType.value;

      if (
        CheckIfInputEmpty(dateOfWatchingRef.current) ||
        CheckIfInputEmpty(dateOfAddingRef.current)
      ) {
        toast.error("Please make sure all fields are filled");
        return;
      }

      if (
        selectedWatchingType?.value !== "" &&
        selectedWatchingType.value === "watched"
      ) {
        formData.dateOfWatching = dateOfWatchingRef.current.value;
        console.log(formData.dateOfWatching);
      }
      if (
        selectedWatchingType?.value !== "" &&
        selectedWatchingType.value === "planning to watch"
      ) {
        formData.dateOfAdding = dateOfAddingRef.current.value;
      }

      // seriesNameRef.current.value = "";
      // urlRef.current.value = "";
      // if (watched) {
      //   dateOfWatchingRef.current.value = "";
      // }
      // if (planningToWatch) {
      //   dateOfAddingRef.current.value = "";
      // }

      // dispatch(appStateActions.setSelectedCountry(null));
      // dispatch(appStateActions.setSelectedWatchingType(null));

      setIsSubmitting(true);

      dispatch(appStateActions.setNewSeriesData(formData));

      setWatched(false);
      setPlanningToWatch(false);
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const jwtToken = getAuthToken();
    const sendData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API}/api/v1/series`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${jwtToken}`,
            },
            body: JSON.stringify(newSeriesData),
          }
        );

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message);
        }
        const data = await response.json();
        seriesNameRef.current.value = "";
        urlRef.current.value = "";
        if (watched) {
          dateOfWatchingRef.current.value = "";
        }
        if (planningToWatch) {
          dateOfAddingRef.current.value = "";
        }

        dispatch(appStateActions.setSelectedCountry(null));
        dispatch(appStateActions.setSelectedWatchingType(null));
        toast.success(data.message);
      } catch (error) {
        toast.error(error.message);
      }
    };

    if (newSeriesData !== null) {
      sendData();
      dispatch(appStateActions.setNewSeriesData(null));
    }
    window.scrollTo(0, document.getElementById("starter").offsetTop);
  }, [newSeriesData]);

  return (
    <section className={styles["main-section"]}>
      <TitleSection title="Add Series" />
      <section className={styles["form-section"]}>
        <form onSubmit={addSeriesHandler} className={styles.form}>
          <Input
            label="Series Name"
            ref={seriesNameRef}
            input={{
              id: "series-name",
              name: "series-name",
              type: "text",
              placeholder: "Taxi Driver",
              disabled: isSubmitting,
            }}
          />
          <Input
            label="Series URL"
            ref={urlRef}
            input={{
              id: "series-url",
              name: "series-url",
              type: "text",
              placeholder: "https://www.example.com",
              disabled: isSubmitting,
            }}
          />
          <div className={styles["input-title"]}>
            <p>Country</p>
            <Dropdown
              identifier="country"
              // isEmpty={false}
              disabled={isSubmitting}
              list={countryList}
              placeholder="United States"
            />
          </div>
          <div className={styles["input-title"]}>
            <p>Watching Type</p>
            <Dropdown
              identifier="watchingType"
              // isEmpty={false}
              disabled={isSubmitting}
              list={watchingTypeList}
              placeholder="Watched or Planning to Watch"
            />
          </div>
          {selectedWatchingType?.value === "watched" && (
            <Input
              label="Date of Watching"
              dateColor={dateColor}
              ref={dateOfWatchingRef}
              input={{
                id: "date-of-watching",
                name: "date-of-watching",
                type: "date",
                disabled: isSubmitting,
                onChange: dateOfWatchingChangeHandler,
              }}
            />
          )}
          {selectedWatchingType?.value === "planning to watch" && (
            <Input
              label="Date of Adding"
              dateColor={dateColor}
              ref={dateOfAddingRef}
              input={{
                id: "date-of-adding",
                name: "date-of-adding",
                type: "date",
                disabled: true,
                value: formattedDate,
                onChange: dateOfWatchingChangeHandler,
              }}
            />
          )}
          <div className={styles["form-actions"]}>
            {isSubmitting && (
              <div className={styles["bar-container"]}>
                <BarLoader />
              </div>
            )}
            {!isSubmitting && (
              <Button type="submit" className={styles.button}>
                Add Series
              </Button>
            )}
          </div>
        </form>
      </section>
    </section>
  );
};

export default AddSeries;
