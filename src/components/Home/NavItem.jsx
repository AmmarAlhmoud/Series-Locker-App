import NavBtn from "../UI/NavBtn";
import styles from "./NavItem.module.css";

const NavItem = ({ title, src, to }) => {
  return (
    <li className={styles.item}>
      <img src={src} alt={title + " Image"} />
      <div>
        <h2>{title}</h2>
        <NavBtn to={to}>Naviagte To</NavBtn>
      </div>
    </li>
  );
};

export default NavItem;
