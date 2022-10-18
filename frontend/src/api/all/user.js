import { get, post, put, headerForMultipleFields } from "./../fetch";

export const registerAccount = (data) => {
  return post("/account/register", data, headerForMultipleFields);
};

export const loginAccount = (data) => {
  return post("/account/login", data);
};

export const logoutAccount = () => {
  return get(`/account/logout`);
};

export const getPeople = () => {
  return get(`/people`);
};

export const getAccount = () => {
  return get(`/account`);
};

export const updateAccount = (data) => {
  return put(`/account`, data);
};
