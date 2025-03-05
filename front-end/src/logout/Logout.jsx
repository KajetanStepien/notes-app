import { useNavigate } from "react-router-dom";
import styles from "./Logout.module.css";

export function Logout() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");

    navigate("/login");

    window.location.reload();
  };

  return (
    <button className={styles.button} onClick={handleLogout}>
      Logout
    </button>
  );
}
