import {
  USER_LOGIN_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT,
  USER_REGISTER_FAIL,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_LOADED,
  AUTH_ERROR
} from "../actions/types";

let user = JSON.parse(localStorage.getItem('userInfo'));
const initialState = user ? { isAuth: true, user } : {isAuth:false};
// reducers for all users
export const usersReducer = (state =initialState, action) => {
  switch (action.type) {
    case USER_LOADED:
      return {usersList: action.payload };
    case AUTH_ERROR:
      return {};
    default:
      return state;
  }
}
// reducer for logged in user
export const userLoginReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_LOGIN_REQUEST:
      return { loadingBar: true};
    case USER_LOGIN_SUCCESS:
      return { loadingBar: false,isAuth: true, user: action.payload };
    case USER_LOGIN_FAIL:
      return { loadingBar: false,isAuth:false, error: action.payload };
    case AUTH_ERROR:
    case USER_LOGOUT:
      return {isAuth:false};
    default:
      return state;
  }
};
//reducer for registered user
export const userRegisterReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_REGISTER_REQUEST:
      return { loadingBar: true };
    case USER_REGISTER_SUCCESS:
      return { loadingBar: false, isAuth: true, user: action.payload };
    case USER_REGISTER_FAIL:
      return { loadingBar: false, error: action.payload };
    default:
      return state;
  }
};