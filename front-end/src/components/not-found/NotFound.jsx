import styles from "./NotFound.module.css";
import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <div className={styles["error-page"]}>
      <h2>Site not found!</h2>
      <p>Incorecct URL Address!</p>
      <Link to="..">Back</Link>
    </div>
  );
}
