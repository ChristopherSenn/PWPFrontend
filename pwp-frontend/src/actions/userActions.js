import {
    USER_LOGIN_FAIL,
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGOUT,
    USER_REGISTER_FAIL,
    USER_REGISTER_REQUEST,
    USER_REGISTER_SUCCESS,
  } from "./types";
  import axios from "axios";
  import { authHeader } from "../utilis/setToken";

 // Login function
  export const login = (username, password) => async (dispatch) => {
    try {
      dispatch({ type: USER_LOGIN_REQUEST });
  
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
  
      // Send post request with login data
      const { data } = await axios.post(
        'http://localhost:4500/users/login',
        { username, password },
        config
      );
  
      dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
  
      // Save the info about the user, who logs in, in local storage
      localStorage.setItem("userInfo", JSON.stringify(data));

    } catch (error) {
      dispatch({
        type: USER_LOGIN_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

  // Register function which saves the provided username, email and password to DB
  export const register = (username, email, password, roles) => async (dispatch) => {
    try {
      dispatch({ type: USER_REGISTER_REQUEST });
  
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
  
      // Send post request with data of new user who is registering
      const { data } = await axios.post(
        "http://localhost:4500/users/register",
        { username, email, password, roles },
        config
      );
  
      // Save user data in global state
      dispatch({ type: USER_REGISTER_SUCCESS, payload: data });
      dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
  
      // Save the info about the user, who logs in, in local storage
      localStorage.setItem("userInfo", JSON.stringify(data));
    } catch (error) {
      // If registration fails, save the error in global state
      dispatch({
        type: USER_REGISTER_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };
  //Logout function which updates global state and remove user infos from local storage
  export const logout = () => async (dispatch) => {
    localStorage.removeItem("userInfo");
    dispatch({ type: USER_LOGOUT });
  };

  // Function that loads all users which are saved in DB
  export const loadUsers = async () =>{
    try{
      const requestOptions = {
        headers: authHeader()
      };
      return await axios.get('http://localhost:4500/users', requestOptions)
    } catch(error){
      console.log(error.message)
    }
  }