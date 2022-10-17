import Layout from "../Layout";
import Account from "../pages/Account";
import Main from "../pages/Main";
import People from "../pages/People";

const routes = [
  {
    path: "/",
    layout: <Layout />,
    component: <Main />,
    exact: true,
  },
  {
    path: "/account",
    layout: <Layout />,
    component: <Account />,
    exact: true,
  },
  {
    path: "/people",
    layout: <Layout />,
    component: <People />,
    exact: true,
  },
];

export default routes;
