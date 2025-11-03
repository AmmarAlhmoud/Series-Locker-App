import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Cookies from "js-cookie";

import TitleSection from "./../TitleSection";
import Input from "../UI/Input";
import Button from "./../UI/Button";
import Suggestion from "../Suggestion";
import BarLoader from "../UI/BarLoader";

import styles from "./Login.module.css";


const Login = () => {
  const [loading, setLoading] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [validationTimer, setValidationTimer] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear any existing timer
    clearTimeout(validationTimer);

    // Set a new timer to trigger validation after 1.5 seconds
    const newTimer = setTimeout(() => {
      const validationErrors = validateForm({ ...formData, [name]: value });
      setErrors(validationErrors);
    }, 1500);

    setValidationTimer(newTimer);
  };

  const validateForm = (data) => {
    const errors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (data.email) {
      if (!emailRegex.test(data.email)) {
        errors.email = "Invalid email format";
        toast.error(errors.email);
      }
    }

    if (data.password) {
      if (!data.password) {
        errors.password = "Password is required";
        toast.error(errors.password);
      }
    }

    return errors;
  };

  const loginHandler = (event) => {
    event.preventDefault();
    // Final validation before submission
    const validationErrors = validateForm(formData);
    // Check for empty required fields
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all required fields.");
      setErrors({
        ...validationErrors,
        generalError: "Please fill in all required fields.",
      });
    } else {
      // If no errors, submit the form
      if (Object.keys(validationErrors).length === 0) {
        // Submit form data to backend
        setSubmittedData({
          ...formData,
          email: formData.email?.trim(),
          password: formData.password?.trim(),
        });
        setLoading(true);
      }
    }
  };

  useEffect(() => {
    const login = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API}/api/v1/users/login`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(submittedData),
          }
        );

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message);
        }
        const data = await response.json();
        Cookies.set("token", data?.token);
        // Expires in a day.
        const expiration = new Date();
        // Expires after a day.
        expiration.setHours(expiration.getHours() + 24);
        Cookies.set("experation", expiration.toISOString());
        navigate("/");
        toast.success(`Welcome Back, ${data?.data?.user?.username}!`);
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } catch (error) {
        toast.error(error.message);
      }
    };

    if (submittedData !== null) {
      login();
      setSubmittedData(null);
      setLoading(false);
    }

    window.scrollTo(0, document.getElementById("starter").offsetTop);
  }, [submittedData]);

  return (
    <section className={styles["login-section"]}>
      <TitleSection title="Login" />
      <section className={styles["form-section"]}>
        <form onSubmit={loginHandler} className={styles.form}>
          <Input
            label="Email"
            input={{
              id: "email",
              name: "email",
              type: "text",
              placeholder: "jane@gmail.com",
              value: formData?.email,
              onChange: handleChange,
            }}
          />
          <Input
            label="Password"
            input={{
              id: "password",
              name: "password",
              type: "password",
              placeholder: "jane1234",
              value: formData?.password,
              onChange: handleChange,
            }}
          />
          <div className={styles["reset-password"]}>
            <p>Forgot Password? </p>
            <NavLink to="/reset-password">Click Here to Reset</NavLink>
          </div>
          <div className={styles["form-actions"]}>
            {loading && (
              <div className={styles["bar-container"]}>
                <BarLoader />
              </div>
            )}
            {!loading && (
              <Button id="click-login" type="submit" className={styles.button}>
                Login
              </Button>
            )}
          </div>
        </form>
      </section>
      <Suggestion
        to="/signup"
        title={"Don't have an account? Signup here."}
        btnTitle={"Signup"}
      />
    </section>
  );
};

export default Login;
