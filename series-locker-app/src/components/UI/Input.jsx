import { forwardRef } from "react";
import { motion } from "framer-motion";

import styles from "./Input.module.css";

const Input = forwardRef(
  (
    { id, label, input, className, container, scaleY, dateColor, children },
    ref
  ) => {
    return (
      <div className={`${styles.input} ${className || ""} `}>
        {label && <label htmlFor={input.id}>{label}</label>}
        <div className={`${styles["input-container"]} ${container || ""} `}>
          {children}
          <motion.input
            autoComplete="off"
            className={id ? styles.search : ""}
            whileFocus={{ scaleY: scaleY || 1.1 }}
            transition={{ type: "spring", duration: 0.5 }}
            {...input}
            style={{ color: dateColor ? "black" : "" }}
            ref={ref}
          />
        </div>
      </div>
    );
  }
);

export default Input;
