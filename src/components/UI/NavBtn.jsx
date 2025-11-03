import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

import styels from "./NavBtn.module.css";

function NavBtn(props) {
  return (
    <motion.button
      id={props.id}
      className={`${styels.btn} ${props.className}`}
      type={props.type || "button"}
      onClick={props.onClick}
      name={props.name}
      disabled={props.disabled}
      whileHover={{ scale: props.scale || 1.08 }}
      transition={{ type: "spring", stiffness: props.stiffness || 100 }}
      style={props.style}
    >
      <NavLink
        className={`${styels["nav-link"]} ${
          props.navError ? styels["nav-link-error"] : ""
        }`}
        to={props.to}
      >
        {props.children}
      </NavLink>
    </motion.button>
  );
}

export default NavBtn;
