import { redirect } from "react-router-dom";
import Cookies from "js-cookie";

export const logoutAction = () => {
  Cookies.remove("token");
  Cookies.remove("experation");

  return redirect("/");
};
