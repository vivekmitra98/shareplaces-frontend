import React, { useContext } from "react";
import { NavLink } from "react-router-dom";

import { AuthContext } from "../../context/auth-context";

import styles from "./NavLinks.module.css";

const NavLinks = (props) => {
  const authCtx = useContext(AuthContext);

  return (
    <ul className={styles["nav-links"]}>
      <li>
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? styles.active : undefined)}
        >
          ALL USERS
        </NavLink>
      </li>
      {authCtx.isLoggedIn && (
        <li>
          <NavLink
            to={`/${authCtx.userId}/places`}
            className={({ isActive }) => (isActive ? styles.active : undefined)}
          >
            MY PLACES
          </NavLink>
        </li>
      )}
      {authCtx.isLoggedIn && (
        <li>
          <NavLink
            to="/places/new"
            className={({ isActive }) => (isActive ? styles.active : undefined)}
          >
            ADD PLACE
          </NavLink>
        </li>
      )}
      {!authCtx.isLoggedIn && (
        <li>
          <NavLink
            to="/auth"
            className={({ isActive }) => (isActive ? styles.active : undefined)}
          >
            LOGIN | SIGNUP
          </NavLink>
        </li>
      )}
      {authCtx.isLoggedIn && (
        <li>
          <button onClick={authCtx.logout}>LOGOUT</button>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
