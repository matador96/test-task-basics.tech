import React from "react";
import ReactDOM from "react-dom/client";
import "./view/css/index.css";
import reportWebVitals from "./reportWebVitals";
import RouterLayout from "./routes/RouterLayout";
import store from "./store/index";
import { Provider } from "react-redux";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <RouterLayout />
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
