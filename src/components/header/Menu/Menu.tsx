import { Link, useNavigate } from "react-router-dom";
import styles from "./Menu.module.css";
import Authorize from "../../authorize/Authorize";

const Menus = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.removeItem("token");
    navigate("/login");
  };
  return (
    <>
      <div className={`${styles.menus}`}>
        <ul>
          <li
            className={`${styles.menuItem} ${
              location.pathname.includes("/applicant") ? styles.active : ""
            }`}
          >
            <Link to="/applicant">Applicant</Link>
          </li>
          <li
            className={`${styles.menuItem} ${
              location.pathname.includes("/job") ? styles.active : ""
            }`}
          >
            <a href={import.meta.env.VITE_JOB_URL}>Job</a>
          </li>
          {/* University */}
          <Authorize allowedPermission="only_HR">
          <li
            className={`${styles.menuItem} ${
              location.pathname.includes("/university") 
              ? styles.active : ""
            }`}
          >
            <Link to="/university">University</Link>
          </li>
          </Authorize>
        </ul>
      </div>
      <div className={`${styles.login}`}>
        {token ? (
          <a onClick={handleLogout} className={styles.login}>
            Log Out
          </a>
        ) : (
          <a href="/login">Login</a>
        )}
      </div>
    </>
  );
};

export default Menus;
