import { motion } from "framer-motion";

import styels from "./Button.module.css";

function Button(props) {
  return (
    <motion.button
      id={props.id}
      className={`${styels.btn} ${props.className}`}
      type={props.type || "button"}
      onClick={props.onClick}
      name={props.name}
      disabled={props.disabled}
      whileHover={{ scale: props.scale || 1.03 }}
      transition={{ type: "spring", stiffness: props.stiffness || 80 }}
      style={props.style}
    >
      {props.children}
    </motion.button>
  );
}

export default Button;
