import { Provider } from "react-redux";
import { createRoot } from "react-dom/client";
import { Toaster } from "sonner";
import store from "./store/index";

import Success_Ic from "./assets/icons/Toast/success_icon.png";
import Error_Ic from "./assets/icons/Toast/error_icon.png";

import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
    <Toaster
      toastOptions={{
        className: "my-toast",
      }}
      offset="22px"
      visibleToasts={4}
      // richColors={true}
      icons={{
        success: <img src={Success_Ic} alt="success" />,
        // info: <InfoIcon />,
        // warning: <WarningIcon />,
        error: <img src={Error_Ic} alt="error" />,
        // loading: <LoadingIcon />,
      }}
    />
  </Provider>
);
