import {
HUBS_ERROR,
GET_HUBS,
GET_HUB_BY_USERID
  } from "./types";
import axios from 'axios'
import { authHeader } from "../utilis/setToken";

//get all hubs
export const getAllHubs = () => async (dispatch) =>{
    try{
      const requestOptions = {
        headers: authHeader()
    };
    const res = await axios.get('http://localhost:4500/hubs', requestOptions)

    dispatch({ type: GET_HUBS, payload: res.data });
    }catch(error){
      dispatch({
        type: HUBS_ERROR,
      })
    }
  }


export const getAllHubsWithoutSettingState = async () => {
  try{
    const requestOptions = {
      headers: authHeader()
    };
    return await axios.get('http://localhost:4500/hubs', requestOptions)
  } catch(error){
    console.log(error.message)
  }
} 