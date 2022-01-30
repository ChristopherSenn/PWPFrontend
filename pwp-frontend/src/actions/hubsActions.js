import axios from 'axios'
import { authHeader } from "../utilis/setToken";


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

export const deleteHub = async (hubId) => {
  try{
    return await axios.delete('http://localhost:4500/hubs/deleteHub', {
      headers: authHeader(),
      data: {
        "hubId": hubId
      }
    });
  } catch(error){
    console.log(error.message)
  }
}

