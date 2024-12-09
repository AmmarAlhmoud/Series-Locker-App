import { useState, useRef, useEffect } from "react";
import { backIn } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { appStateActions } from "../../store/app-state-slice";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";

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
    };
  };

  const BlackColorWithHover = (styles) => {
    return {
      ...styles,
      color: "black",

      ":hover": {
        color: "rgba(255, 255, 255,80%)",
      },
    };
  };

  const colorStyles = {
    // input field
    menu: (styles) => ({
      ...styles,
      width: width ? width : 564,
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
    input: (styles) => {
      return {
        ...styles,
        color: "black",
        paddingLeft: "0.2em",
      };
    },
    singleValue: (styles) => {
      return {
        ...styles,
        color: "black",
        paddingLeft: "0.2em",
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
