import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { appStateActions } from "../../store/app-state-slice";
import Select from "react-select";

const Dropdown = ({
  isEmpty,
  fetchedValue,
  disabled,
  width,
  list,
  placeholder,
  identifier,
  searchField,
}) => {
  const selectRef = useRef();
  const [currentFetchedData, setCurrentFetchedData] = useState({});
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  let selectedItem = "";

  const selectedCountry = useSelector(
    (state) => state.appState.selectedCountry
  );
  const selectedWatchingType = useSelector(
    (state) => state.appState.selectedWatchingType
  );

  if (identifier === "country") {
    selectedItem = selectedCountry;
  }

  if (identifier === "watchingType") {
    selectedItem = selectedWatchingType;
  }

  const options = list;
  const BlackColor = (styles) => {
    return {
      ...styles,
      color: "black",
      ...(windowWidth <= 768 && {
        fontSize: "0.9rem",
      }),
    };
  };

  const BlackColorWithHover = (styles) => {
    return {
      ...styles,
      color: "black",
      ...(windowWidth <= 768 && {
        fontSize: "0.9rem",
      }),
      ":hover": {
        color: "rgba(0, 0, 0,65%)",
      },
    };
  };

  const colorStyles = {
    // input field
    menu: (styles) => ({
      ...styles,
      width: width ? width : 564,
      ...(windowWidth <= 1439 && {
        maxWidth: width ? "21rem" : "36rem",
        fontSize: "0.9rem",
      }),
      ...(windowWidth <= 1280 && {
        maxWidth: width ? "20rem" : "36rem",
      }),
      ...(windowWidth <= 1024 && {
        maxWidth: width ? "18rem" : "36rem",
      }),
      ...(windowWidth <= 768 && {
        maxWidth: width ? "16rem" : "27.4rem",
      }),
      ...(windowWidth <= 640 && {
        maxWidth: width ? "13rem" : "21.4rem",
      }),
      ...(windowWidth <= 482 && {
        maxWidth: width ? "11.4rem" : "15.4rem",
      }),

      marginLeft: "0.4em",
      backgroundColor: "rgba(187, 187, 187, 100%)",
    }),
    control: (styles) => ({
      ...styles,
      backgroundColor: "rgba(187, 187, 187, 15%)",
      border: `${isEmpty ? "2px solid red" : "none"}`,
      borderRadius: "0.6em",
      marginLeft: "0.4em",
      height: "auto",
      width: width ? width : 565,
      ...(windowWidth <= 1439 && {
        maxWidth: width ? "21rem" : "36rem",
        fontSize: "0.9rem",
      }),
      ...(windowWidth <= 1280 && {
        maxWidth: width ? "20rem" : "36rem",
      }),
      ...(windowWidth <= 1024 && {
        maxWidth: width ? "18rem" : "36rem",
      }),
      ...(windowWidth <= 768 && {
        maxWidth: width ? "16rem" : "27.4rem",
      }),
      ...(windowWidth <= 640 && {
        maxWidth: width ? "13rem" : "21.4rem",
      }),
      ...(windowWidth <= 482 && {
        maxWidth: width ? "11.4rem" : "15.4rem",
      }),
      // ":hover": {
      //   border: "2px solid #b2b4b7",
      // },
      boxShadow: "none",
    }),
    // options style
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      return {
        ...styles,
        backgroundColor: "rgba(187, 187, 187, 15%)",
        color: "#333",
        fontWeight: "bold",
        textAlign: "start",
        paddingLeft: "1em",
        ":hover": {
          backgroundColor: "rgba(255, 255, 255,0.2)",
        },
        ":focus": {
          border: "none",
          outline: "none",
        },
      };
    },
    multiValue: (styles) => {
      return {
        ...styles,
        backgroundColor: "rgba(187, 187, 187, 15%)",
        borderRadius: "0.8em",
        color: "#fff",
        padding: "0.2em",
      };
    },
    multiValueRemove: (styles) => {
      return {
        ...styles,
        color: "#fff",
        cursor: "pointer",
        ":hover": {
          backgroundColor: "rgba(255, 255, 255,0.2)",
        },
      };
    },
    menuList: (styles) => {
      return {
        ...styles,
        backgroundColor: "rgba(187, 187, 187, 15%)",
        marginLeft: "0.4em",
        height: identifier === "watchingType" ? "82px" : "155px",
        "&::-webkit-scrollbar": {
          backgroundColor: "rgb(255, 255, 255, 0.1)",
          width: "5px",
          height: "10px",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#d9d9d9",
          borderRadius: "10px",
        },
      };
    },
    // where you type
    input: (styles) => {
      return {
        ...styles,
        color: "black",
        paddingLeft: "0.2em",
        ...(windowWidth <= 768 && {
          fontSize: "0.9rem",
        }),
      };
    },
    // value you choose
    singleValue: (styles) => {
      return {
        ...styles,
        color: "black",
        paddingLeft: "0.2em",
        ...(windowWidth <= 768 && {
          fontSize: "0.9rem",
        }),
      };
    },
    multiValueLabel: BlackColor,
    dropdownIndicator: BlackColorWithHover,
    loadingIndicator: BlackColor,
    indicatorSeparator: BlackColor,
    clearIndicator: BlackColorWithHover,
    noOptionsMessage: BlackColor,
    placeholder: (styles) => {
      return {
        ...styles,
        color: "#717070",
        textAlign: "start",
        paddingLeft: "0.2em",
        ...(windowWidth <= 768 && {
          fontSize: "0.9rem",
        }),
      };
    },
  };

  const dispatch = useDispatch();

  const selectedItemsHandler = (selected) => {
    if (identifier === "watchingType") {
      dispatch(appStateActions.setSelectedWatchingType(selected));
    }

    if (identifier === "country") {
      dispatch(appStateActions.setSelectedCountry(selected));
    }
  };

  useEffect(() => {
    let currentFetchedValue = [];
    if (fetchedValue && identifier === "country") {
      currentFetchedValue = list.filter((item) => item.label === fetchedValue);
      setCurrentFetchedData(currentFetchedValue[0]);
      dispatch(appStateActions.setSelectedCountry(currentFetchedValue[0]));
    }
    if (fetchedValue && identifier === "watchingType") {
      currentFetchedValue = list.filter((item) => item.value === fetchedValue);
      setCurrentFetchedData(currentFetchedValue[0]);
      dispatch(appStateActions.setSelectedWatchingType(currentFetchedValue[0]));
    }

    if (!fetchedValue && identifier === "country") {
      dispatch(appStateActions.setSelectedCountry(null));
    }
    if (!fetchedValue && identifier === "watchingType") {
      dispatch(appStateActions.setSelectedWatchingType(null));
    }

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [fetchedValue, searchField, currentFetchedData]);

  return (
    <Select
      value={selectedItem !== "" ? selectedItem : currentFetchedData}
      placeholder={placeholder}
      isDisabled={disabled}
      onChange={selectedItemsHandler}
      isSearchable={identifier === "country" ? true : false}
      options={options}
      styles={colorStyles}
    />
  );
};

export default Dropdown;
