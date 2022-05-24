import React from "react";
import ReactDOM from "react-dom";

import App from "./App";

import AuthContextProvider from "./shared/context/AuthContextProvider";

import "./index.css";

ReactDOM.render(
  <AuthContextProvider>
    <App />
  </AuthContextProvider>,
  document.getElementById("root")
);
