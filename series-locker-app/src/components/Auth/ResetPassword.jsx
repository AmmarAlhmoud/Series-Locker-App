import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import TitleSection from "../TitleSection";
import Input from "../UI/Input";
import Button from "../UI/Button";
import Suggestion from "../Suggestion";
import BarLoader from "../UI/BarLoader";

import styles from "./ResetPassword.module.css";

const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
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

    return errors;
  };

  const resetPasswordHandler = (event) => {
    event.preventDefault();
    // Final validation before submission
    const validationErrors = validateForm(formData);
    // Check for empty required fields
    if (!formData.email) {
      toast.error("Please fill in your email.");
      setErrors({
        ...validationErrors,
        generalError: "Please fill in your email.",
      });
    } else {
      // If no errors, submit the form
      if (Object.keys(validationErrors).length === 0) {
        // Submit form data to backend
        setSubmittedData({
          ...formData,
          email: formData.email?.trim(),
        });
        setLoading(true);
      }
    }
  };

  useEffect(() => {
    const forgotPassword = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API}/api/v1/users/forgotPassword`,
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
        navigate("/");
        toast.success(data.message);
      } catch (error) {
        toast.error(error.message);
      }
    };

    if (submittedData !== null) {
      forgotPassword();
      setSubmittedData(null);
      setLoading(false);
    }
    window.scrollTo(0, document.getElementById("starter").offsetTop);
  }, [submittedData]);

  return (
    <section className={styles["reset-password-section"]}>
      <TitleSection title="Reset Password" />
      <section className={styles["form-section"]}>
        <form onSubmit={resetPasswordHandler} className={styles.form}>
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
          <div className={styles["form-actions"]}>
            {loading && (
              <div className={styles["bar-container"]}>
                <BarLoader />
              </div>
            )}
            {!loading && (
              <Button id="click-login" type="submit" className={styles.button}>
                Submit
              </Button>
            )}
          </div>
        </form>
      </section>
    </section>
  );
};

export default ResetPassword;
