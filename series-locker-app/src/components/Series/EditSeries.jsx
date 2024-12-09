import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { countryList, watchingTypeList } from "./../../util/SelectionLists";
import { appStateActions } from "../../store/app-state-slice";
import validator from "validator";
import { format } from "date-fns";
import { toast } from "sonner";
import { getAuthToken } from "../../util/auth";

import TitleSection from "../TitleSection";
import Input from "../UI/Input";
import Button from "../UI/Button";
import Dropdown from "../UI/dropdown";
import BarLoader from "../UI/BarLoader";

import styles from "./EditSeries.module.css";

const EditSeries = () => {
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dateColor, setDateColor] = useState(false);
  const [watched, setWatched] = useState(false);
  const [planningToWatch, setPlanningToWatch] = useState(false);

  const [seriesData, setSeriesData] = useState(null);
  const [watchingDateStateValue, setwatchingDateStateValue] = useState();
  const { id } = useParams();
  const naviagte = useNavigate();

  // Form data
  const selectedCountry = useSelector(
    (state) => state.appState.selectedCountry
  );
  const selectedWatchingType = useSelector(
    (state) => state.appState.selectedWatchingType
  );

  const editedSeriesData = useSelector(
    (state) => state.appState.editedSeriesData
  );
  const seriesNameRef = useRef();
  const urlRef = useRef();
  const dateOfWatchingRef = useRef();
  const dateOfAddingRef = useRef();
  const today = new Date();
  const formattedDate = format(today, "yyyy-MM-dd");
  const formatter = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  let watchingDate = "";
  if (seriesData !== null && seriesData?.dateOfWatching) {
    watchingDate = format(
      formatter.format(new Date(seriesData?.dateOfWatching)),
      "yyyy-MM-dd"
    );
  }

  const dateOfWatchingChangeHandler = (event) => {
    setDateColor(true);
    setwatchingDateStateValue(event.target.value);
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

  const CheckIfChanged = (dataToCheck, currentData) => {
    const fetchedData = { ...currentData };
    const checkData = { ...dataToCheck };

    delete fetchedData["dateOfWatching"];
    delete fetchedData["dateOfAdding"];
    delete checkData["dateOfWatching"];
    delete checkData["dateOfAdding"];

    const fields = Object.keys(checkData).some(
      (key) => checkData[key].trim() !== fetchedData[key]
    );

    const formatter = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    const watchingDate = format(
      formatter.format(new Date(seriesData?.dateOfWatching)),
      "yyyy-MM-dd"
    );

    const addingDate = format(
      formatter.format(new Date(seriesData?.dateOfAdding)),
      "yyyy-MM-dd"
    );

    let dateChanged = false;
    if (
      watchingDate !== dataToCheck.dateOfWatching &&
      dataToCheck.watchingType === "watched"
    ) {
      dateChanged = true;
    }

    if (
      addingDate !== dataToCheck.dateOfAdding &&
      dataToCheck.watchingType === "planning to watch"
    ) {
      dateChanged = true;
    }

    console.log(fields, dateChanged);
    return fields || dateChanged;
  };

  const editSeriesHandler = (event) => {
    event.preventDefault();

    if (
      !CheckIfChanged(
        {
          name: seriesNameRef.current.value,
          url: urlRef.current.value,
          country: selectedCountry?.label,
          watchingType: selectedWatchingType?.value,
          dateOfWatching: dateOfWatchingRef?.current?.value,
          dateOfAdding: dateOfAddingRef?.current?.value,
        },
        seriesData
      )
    ) {
      toast.error(
        "Please make sure you have edited any of the feilds before proceeding."
      );
      return;
    }

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

      setIsSubmitting(true);

      dispatch(appStateActions.setEditedSeriesData(formData));

      setWatched(false);
      setPlanningToWatch(false);
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const jwtToken = getAuthToken();
    const getData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API}/api/v1/series/${id}`,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message);
        }
        const data = await response.json();
        setSeriesData(data?.data?.series);
      } catch (error) {
        toast.error(error.message);
      }
    };

    const updateData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API}/api/v1/series/${id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${jwtToken}`,
            },
            body: JSON.stringify(editedSeriesData),
          }
        );

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message);
        }
        const data = await response.json();
        toast.success(data.message);
      } catch (error) {
        toast.error(error.message);
      }
    };

    if (seriesData === null) {
      getData();
    }

    if (editedSeriesData !== null) {
      updateData();
      dispatch(appStateActions.setEditedSeriesData(null));
      if (editedSeriesData.watchingType === "watched") {
        naviagte("/watched-series");
      } else {
        naviagte("/planning-to-watch");
      }
    }
    window.scrollTo(0, document.getElementById("starter").offsetTop);
  }, [editedSeriesData, seriesData]);

  return (
    <section className={styles["main-section"]}>
      <TitleSection title="Edit Series" />
      <section className={styles["form-section"]}>
        <form onSubmit={editSeriesHandler} className={styles.form}>
          <Input
            label="Series Name"
            ref={seriesNameRef}
            input={{
              id: "series-name",
              name: "series-name",
              type: "text",
              placeholder: "Taxi Driver",
              disabled: isSubmitting,
              defaultValue: seriesData?.name,
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
              defaultValue: seriesData?.url,
            }}
          />
          <div className={styles["input-title"]}>
            <p>Country</p>
            <Dropdown
              identifier="country"
              // isEmpty={false}
              fetchedValue={seriesData?.country}
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
              fetchedValue={seriesData?.watchingType}
              disabled={isSubmitting}
              list={watchingTypeList}
              placeholder="Watched or Planning to Watch"
            />
          </div>
          {(selectedWatchingType?.value || seriesData?.watchingType) ===
            "watched" && (
            <Input
              label="Date of Watching"
              dateColor={dateColor || watchingDate}
              ref={dateOfWatchingRef}
              input={{
                id: "date-of-watching",
                name: "date-of-watching",
                type: "date",
                disabled: isSubmitting,
                onChange: dateOfWatchingChangeHandler,
                value: !dateColor ? watchingDate : watchingDateStateValue,
              }}
            />
          )}
          {(selectedWatchingType?.value || seriesData?.watchingType) ===
            "planning to watch" && (
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
                Edit Series
              </Button>
            )}
          </div>
        </form>
      </section>
    </section>
  );
};

export default EditSeries;
