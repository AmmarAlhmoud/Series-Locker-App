import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import TitleSection from "../TitleSection";
import Input from "../UI/Input";
import Button from "../UI/Button";
import BarLoader from "../UI/BarLoader";

import styles from "./NewPassword.module.css";

const NewPassword = () => {
  const [loading, setLoading] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const navigate = useNavigate();
  const { resetToken } = useParams();

  const [formData, setFormData] = useState({
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

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

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

  const newPasswordHandler = (event) => {
    event.preventDefault();
    // Final validation before submission
    const validationErrors = validateForm(formData);
    // Check for empty required fields
    if (!formData.password || !formData.confirmPassword) {
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
          password: formData.password?.trim(),
          confirmPassword: formData.confirmPassword?.trim(),
        });
        setLoading(true);
      }
    }
  };

  useEffect(() => {
    const resetPassword = async () => {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_API
          }/api/v1/users/resetPassword/${resetToken}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(submittedData),
          }
        );

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message);
        }
        const data = await response.json();
        // TODO: possibly add reset password button to the footer so if the user logedin he can change the password.
        navigate("/");
        toast.success(
          `Welcome Back, ${data?.data?.user?.username}!. Your password has been reset successfully.`
        );
      } catch (error) {
        navigate("/");
        toast.error(error.message);
      }
    };

    if (submittedData !== null) {
      resetPassword();
      setSubmittedData(null);
      setLoading(false);
    }
    window.scrollTo(0, document.getElementById("starter").offsetTop);
  }, [submittedData]);

  return (
    <section className={styles["new-password-section"]}>
      <TitleSection title="Set New Password" />
      <section className={styles["form-section"]}>
        <form onSubmit={newPasswordHandler} className={styles.form}>
          <Input
            label="New Password"
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
                Submit
              </Button>
            )}
          </div>
        </form>
      </section>
    </section>
  );
};

export default NewPassword;
