import { useState, useRef, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { countryList } from "../../util/SelectionLists";
import { useSelector, useDispatch } from "react-redux";
import { appStateActions } from "../../store/app-state-slice";
import { toast } from "sonner";
import { motion } from "framer-motion";
import useDebounce from "../../util/useDebounce";
import { getAuthToken } from "../../util/auth";

import Dropdown from "../UI/dropdown";
import Input from "../UI/Input";
import SeriesCard from "./SeriesCard";

import PaginationItem from "./PaginationItem";

import IC_Search from "./../../assets/icons/Series/search.png";

import styles from "./SeriesList.module.css";
import BarLoader from "../UI/BarLoader";

let initialLoad = true;

const SeriesList = ({ pageName }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [dateColor, setDateColor] = useState(false);
  const refreshData = useSelector((state) => state.appState.refreshData);

  const [seriesListData, setSeriesListData] = useState(null);

  const dispatch = useDispatch();

  // Pagination
  const [searchParams, setSearchParams] = useSearchParams();
  const pageNumber = searchParams.get("page") || "1";

  // Filter
  const [inputValue, setInputValue] = useState("");
  const [dateValue, setDateValue] = useState("");
  const clearFilter = useSelector((state) => state.appState.clearFilter);
  const selectedCountry = useSelector(
    (state) => state.appState.selectedCountry
  );
  const debouncedValue = useDebounce(inputValue, 1000);

  useEffect(() => {
    const jwtToken = getAuthToken();
    const getData = async (filterArgs = "") => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API}/api/v1/series?page=${
            filterArgs !== "" ? "" : pageNumber
          }&watchingType=${pageName}&${filterArgs}`,
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
        setSeriesListData(data.data);
      } catch (error) {
        if (error.message === "Failed to fetch") {
          return;
        }
        toast.error(error.message);
      }
    };

    if (
      pageNumber >= 1 &&
      debouncedValue?.length === 0 &&
      selectedCountry?.label === undefined &&
      dateValue === ""
    ) {
      window.scrollTo(0, document.getElementById("starter").offsetTop);
    }

    if (initialLoad || refreshData || pageNumber >= 1) {
      setIsLoading(true);
      if (
        debouncedValue?.length === 0 &&
        selectedCountry?.label === undefined &&
        dateValue === ""
      ) {
        getData();
      }
      initialLoad = false;
      setIsLoading(false);
      if (refreshData) {
        dispatch(appStateActions.setRefreshData(false));
      }
    }

    if (
      initialLoad === false &&
      (debouncedValue || selectedCountry || dateValue)
    ) {
      let searchQuery = `search=${debouncedValue}`;

      if (selectedCountry?.label !== undefined) {
        searchQuery = searchQuery + `&country=${selectedCountry?.label}`;
      }

      if (dateValue !== "" && pageName === "watched") {
        searchQuery = searchQuery + `&dateOfWatching=${dateValue}`;
      }

      if (dateValue !== "" && pageName === "planning to watch") {
        searchQuery = searchQuery + `&dateOfAdding=${dateValue}`;
      }

      getData(searchQuery);
      dispatch(appStateActions.setClearFilter(true));
    }
  }, [
    initialLoad,
    refreshData,
    pageNumber,
    debouncedValue,
    selectedCountry,
    dateValue,
  ]);

  const dateOfWatchingChangeHandler = (event) => {
    setDateColor(true);
    setDateValue(event.target.value);
  };

  const nameSearchHandler = (event) => {
    setInputValue(event.target.value);
  };

  const clearFilterHandler = () => {
    setInputValue("");
    setDateValue("");
    dispatch(appStateActions.setClearFilter(false));
    dispatch(appStateActions.setSelectedCountry(null));
  };

  return (
    <>
      <section className={styles["form-section"]}>
        <form className={styles["form"]}>
          <div className={`${styles["input-title"]} ${styles["name-search"]}`}>
            <img src={IC_Search} alt="search" />
            <Input
              container={styles["input-container"]}
              className={`${styles["input"]} ${styles["cancel-search-name"]}`}
              label="Series Name"
              input={{
                id: "series-name",
                name: "series-name",
                type: "text",
                placeholder: "Taxi Driver",
                value: inputValue,
                onChange: nameSearchHandler,
              }}
            />
          </div>
          <div className={`${styles["input-title"]} ${styles["dropdown"]}`}>
            <p>Country</p>
            <Dropdown
              width={"22rem"}
              identifier="country"
              isEmpty={false}
              disabled={false}
              searchField={true}
              list={countryList}
              placeholder="United States"
            />
          </div>
          <div className={styles["input-title"]}>
            <Input
              container={styles["input-container"]}
              className={styles["input"]}
              label="Date of Watching"
              dateColor={dateColor}
              input={{
                id: "date-of-watching",
                name: "date-of-watching",
                type: "date",
                value: dateValue,
                onChange: dateOfWatchingChangeHandler,
              }}
            />
          </div>
          <br />
          {clearFilter &&
            (inputValue !== "" ||
              selectedCountry?.label !== undefined ||
              dateValue !== "") && (
              <motion.div
                onClick={clearFilterHandler}
                whileHover={{ scale: 1.05 }}
                className={styles.cancelSearch}
              >
                Clear Filter
              </motion.div>
            )}
        </form>
      </section>
      <section
        className={`${styles["filtered-section"]} ${
          isLoading ? styles.loading : ""
        } ${
          seriesListData !== null && seriesListData?.series.length === 0
            ? styles["no-content"]
            : ""
        } ${
          seriesListData === null && clearFilter !== true
            ? styles["no-content"]
            : ""
        }`}
      >
        {seriesListData?.series !== null &&
          seriesListData?.series?.length !== 0 &&
          seriesListData?.series?.map((series) => (
            <SeriesCard
              key={series._id}
              id={series._id}
              slug={series.slug}
              name={series.name}
              country={series.country}
              date={series.dateOfWatching || series.dateOfAdding}
              url={series.url}
            />
          ))}
        {isLoading && (
          <div className={styles["bar-container"]}>
            <BarLoader />
          </div>
        )}
        {seriesListData?.series !== null &&
          seriesListData?.series?.length === 0 &&
          clearFilter && (
            <div className={styles["no-content"]}>
              Your search did not match any results.
            </div>
          )}
        {seriesListData?.series !== null &&
          seriesListData?.series?.length === 0 &&
          clearFilter !== true && (
            <div className={styles["no-content"]}>
              Your series shelf is empty. Time to fill it up!
            </div>
          )}
        {seriesListData === null && clearFilter !== true && (
          <div className={styles["no-content"]}>
            Server is not available at the moment. Please try again later.
          </div>
        )}
      </section>
      <div className={styles["pagination"]}>
        <PaginationItem dataCount={seriesListData?.docCount} />
      </div>
    </>
  );
};

export default SeriesList;
