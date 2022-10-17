import { LOGIN, LOGOUT, UPDATE } from "../types";

export const loginAction = (payload) => ({
  type: LOGIN,
  payload,
});

export const logoutAction = () => {
  localStorage.removeItem("token");

  return {
    type: LOGOUT,
  };
};

export const updateAction = (payload) => ({
  type: UPDATE,
  payload,
});
