import React, { useEffect, useState } from "react";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./../Layout";
import map from "lodash/map";
import { useDispatch } from "react-redux";
import { loginAction } from "../store/actions/account";

import routes from "./routes";
import { getAccount } from "../api/all/user";

const RouterLayout = () => {
  const dispatch = useDispatch();
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    getAccount()
      .then((result) => {
        if (result.json.data?._id) {
          dispatch(loginAction(result.json.data));
        }
      })
      .finally(() => setFetching(false));
  }, []);

  if (fetching) {
    return <></>;
  }

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {map(routes, (route, index) => (
            <Route
              key={route.path + index + "router"}
              path={route.path}
              exact={route.exact}
              element={route.component}
            />
          ))}
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default RouterLayout;
