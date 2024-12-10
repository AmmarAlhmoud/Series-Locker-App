import { useEffect } from "react";
import { Outlet, useSubmit, useLoaderData } from "react-router-dom";
import { getTokenDuration } from "../util/auth";
import { toast } from "sonner";

const Root = () => {
  const token = useLoaderData();
  const submit = useSubmit();
  console.log("root running....");

  useEffect(() => {
    if (!token) {
      return;
    }

    if (token === "EXPIRED") {
      submit(null, { action: "/logout", method: "POST" });
      toast.error("Your session has expired! please login to get access.");
      return;
    }

    const tokenDuration = getTokenDuration();

    setTimeout(() => {
      submit(null, { action: "/logout", method: "POST" });
      toast.error("Your session has expired! please login to get access.");
    }, tokenDuration);
  }, [token, submit]);

  return <Outlet />;
};

export default Root;
