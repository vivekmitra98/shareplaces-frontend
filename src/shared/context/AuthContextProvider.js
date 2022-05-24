import React, { useCallback, useEffect, useState } from "react";

import { AuthContext } from "./auth-context";

let logoutTimer;

const AuthContextProvider = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);
  const [expirationDate, setExpirationDate] = useState(null);

  const loginHandler = useCallback((uId, tokn, expiration) => {
    setIsLoggedIn(true);
    setUserId(uId);
    setToken(tokn);
    const tokenExpirationDate =
      expiration || new Date(new Date().getTime() + 1000 * 60 * 55);
    setExpirationDate(tokenExpirationDate);
    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId: uId,
        token: tokn,
        tokenExpirationDate: tokenExpirationDate.toISOString(),
      })
    );
  }, []);

  const logoutHandler = useCallback(() => {
    setIsLoggedIn(false);
    setUserId(null);
    setToken(null);
    setExpirationDate(null);
    localStorage.removeItem("userData");
  }, []);

  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem("userData"));

    if (
      storedUserData &&
      new Date(storedUserData.tokenExpirationDate) > new Date()
    ) {
      loginHandler(
        storedUserData.userId,
        storedUserData.token,
        new Date(storedUserData.tokenExpirationDate)
      );
    }
  }, [loginHandler]);

  useEffect(() => {
    if (token && expirationDate) {
      const remainingTime = expirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logoutHandler, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logoutHandler, expirationDate]);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: isLoggedIn,
        userId: userId,
        token: token,
        expirationDate: expirationDate,
        login: loginHandler,
        logout: logoutHandler,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
