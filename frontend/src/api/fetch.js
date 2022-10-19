import toast from "react-hot-toast";

const SUCCESS_STATUS = 200;
const ERROR_STATUS_AUTH = 401;
const ERROR_STATUS_NOT_FOUNT = 404;
const API_URL = "/api";

const generateHeaders = (isFormData = false) => {
  const headers = {};

  const { token } = localStorage;

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (isFormData) {
    return headers;
  }
  headers["Content-Type"] = "application/json";

  return headers;
};

const generateRequestSettings = (method, body, isFormData) => {
  const headers = generateHeaders(isFormData);

  const defaultSettings = { method, headers };
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

export const put = async (destination, body, isFormData) =>
  await doRequest("PUT", destination, body, isFormData);

export const post = async (destination, body, isFormData) =>
  await doRequest("POST", destination, body, isFormData);

export const get = async (destination) =>
  await doRequest("GET", destination, null);

const doRequest = async (method, destination, body, isFormData) => {
  const result = await fetch(
    `${API_URL}${destination}`,
    generateRequestSettings(method, body, isFormData)
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
