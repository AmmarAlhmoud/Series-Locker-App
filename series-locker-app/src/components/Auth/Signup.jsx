import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Cookies from "js-cookie";

import TitleSection from "./../TitleSection";
import Input from "../UI/Input";
import Button from "./../UI/Button";
import Suggestion from "../Suggestion";
import BarLoader from "../UI/BarLoader";

import styles from "./Signup.module.css";

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    if (data.username) {
      if (!data.username) {
        errors.username = "Username is required";
        toast.error(errors.username);
      }
    }

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
      } else if (!passwordRegex.test(data.password)) {
        errors.password =
          "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character";
        toast.error(errors.password);
      }
    }
    if (data.confirmPassword) {
      if (data.password !== data.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
        toast.error(errors.confirmPassword);
      }
    }
    return errors;
  };

  const capitalizeWords = (str) => {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const signupHandler = (event) => {
    event.preventDefault();
    // Final validation before submission
    const validationErrors = validateForm(formData);
    // Check for empty required fields
    if (
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
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
          username: capitalizeWords(formData.username?.trim()),
          email: formData.email?.trim(),
          password: formData.password?.trim(),
          confirmPassword: formData.confirmPassword?.trim(),
        });
        setLoading(true);
      }
    }
  };

  useEffect(() => {
    const signup = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API}/api/v1/users/signup`,
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
        // Expires in 1 hour.
        const expiration = new Date();
        expiration.setHours(expiration.getHours() + 24);
        Cookies.set("experation", expiration.toISOString());
        navigate("/");
        toast.success(
          `Welcome to Series Locker, ${data?.data?.user?.username}!`
        );
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } catch (error) {
        toast.error(error.message);
      }
    };

    if (submittedData !== null) {
      signup();
      setSubmittedData(null);
      setLoading(false);
    }
    window.scrollTo(0, document.getElementById("starter").offsetTop);
  }, [submittedData]);

  return (
    <section className={styles["signup-section"]}>
      <TitleSection title="Signup" />
      <section className={styles["form-section"]}>
        <form onSubmit={signupHandler} className={styles.form}>
          <Input
            label="User Name"
            input={{
              id: "username",
              name: "username",
              type: "text",
              placeholder: "Jane",
              value: formData?.username,
              onChange: handleChange,
            }}
          />
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
          <Input
            label="Confirm Password"
            input={{
              id: "confirmPassword",
              name: "confirmPassword",
              type: "password",
              placeholder: "jane1234",
              value: formData?.confirmPassword,
              onChange: handleChange,
            }}
          />
          <div className={styles["form-actions"]}>
            {loading && (
              <div className={styles["bar-container"]}>
                <BarLoader />
              </div>
            )}
            {!loading && (
              <Button id="click-login" type="submit" className={styles.button}>
                Signup
              </Button>
            )}
          </div>
        </form>
      </section>
      <Suggestion
        to="/login"
        title={"Already have an account? Login here."}
        btnTitle={"Login"}
      />
    </section>
  );
};

export default Signup;
