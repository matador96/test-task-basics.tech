import toast from "react-hot-toast";

const SUCCESS_STATUS = 200;
const ERROR_STATUS_AUTH = 401;
const ERROR_STATUS_NOT_FOUNT = 404;
const API_URL = "/api";

const generateRequestSettings = (method, body, headerSettings) => {
  const { token } = localStorage;

  const headers = {
    //  "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let defaultSettings = { method, headers };

  if (body) {
    return {
      ...defaultSettings,
      body: body,
    };
  }

  return defaultSettings;
};

const requestResult = (res, json) => ({
  headers: res.headers,
  status: res.status,
  json,
});

export const put = async (destination, body) =>
  await doRequest("PUT", destination, body);

export const post = async (destination, body) =>
  await doRequest("POST", destination, body);

export const get = async (destination) =>
  await doRequest("GET", destination, null);

const doRequest = async (method, destination, body) => {
  const result = await fetch(
    `${API_URL}${destination}`,
    generateRequestSettings(method, body)
  ).then((res) => {
    return res.json().then((json) => requestResult(res, json));
  });

  if (result?.json?.token) {
    localStorage.setItem("token", result.json?.token);
  }

  if (result.status === SUCCESS_STATUS) {
    return result;
  }

  if (result.status === ERROR_STATUS_AUTH) {
    return;
  }

  if (result.status === ERROR_STATUS_NOT_FOUNT) {
    return;
  }

  sendErrorNotification(result);
};

const sendErrorNotification = (result) => {
  const errorObj = {
    error: result.status,
    message: result?.json?.message || result?.json?.error,
  };
  toast.error(errorObj?.message || errorObj);
  throw errorObj;
};
