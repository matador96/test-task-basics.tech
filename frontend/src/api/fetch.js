import toast from "react-hot-toast";

const SUCCESS_STATUS = 200;
const ERROR_STATUS_AUTH = 401;
const ERROR_STATUS_NOT_FOUNT = 404;
const API_URL = "/api";

export const headerForMultipleFields = {
  // "Content-Type": "multipart/form-data",
};

const generateRequestSettings = (method, body, headerSettings) => {
  const { token } = localStorage;
  //const isFormData = !!Object.keys(headerSettings).length;

  const headers = {
    "Content-Type": "application/json",
    ...headerSettings,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let defaultSettings = { method, headers };

  if (body) {
    return {
      ...defaultSettings,
      //  body: isFormData ? body : JSON.stringify(body),
      body: JSON.stringify(body),
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

export const post = async (destination, body, headerSettings) =>
  await doRequest("POST", destination, body, headerSettings);

export const get = async (destination) =>
  await doRequest("GET", destination, null);

const doRequest = async (method, destination, body, headerSettings = {}) => {
  const result = await fetch(
    `${API_URL}${destination}`,
    generateRequestSettings(method, body, headerSettings)
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
