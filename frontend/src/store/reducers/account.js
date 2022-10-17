import { LOGIN, LOGOUT, UPDATE } from "../types";

const initialState = {
  id: null,
  name: "",
  email: "",
};

const accountReducer = (prevState = initialState, action) => {
  switch (action.type) {
    case LOGIN:
      return {
        ...prevState,
        ...action.payload,
      };
    case LOGOUT:
      return {
        ...initialState,
      };
    case UPDATE:
      return {
        ...prevState,
        ...action.payload,
      };
    default:
      return prevState;
  }
};

export default accountReducer;
