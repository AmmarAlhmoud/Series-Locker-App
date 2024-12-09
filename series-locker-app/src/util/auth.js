import { redirect } from "react-router-dom";
import Cookies from "js-cookie";
import { toast } from "sonner";

export const getTokenDuration = () => {
  const storedExperationDate = Cookies.get("experation");

  // to convert the string to a date object.
  const experationDate = new Date(storedExperationDate);

  // to get the current date
  const now = new Date();
  // to see if the token expierd or not
  const duration = experationDate.getTime() - now.getTime();

  return duration;
};

export const getAuthToken = () => {
  const token = Cookies.get("token");
  const duration = getTokenDuration();

  if (!token) {
    return null;
  }

  // if the token is expired
  if (duration < 0) {
    return "EXPIRED";
  }

  return token;
};

export const tokenLoader = () => {
  return getAuthToken();
};

export const checkTokenLoader = () => {
  const token = getAuthToken();

  if (!token) {
    toast.error("Please login to get access.");
    return redirect("/login");
  }
  return null;
};

export const checkTokenForAuthPageLoader = () => {
  const token = getAuthToken();

  if (token) {
    return redirect("/");
  }
  return null;
};
