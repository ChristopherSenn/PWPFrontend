import axios from 'axios'
import { authHeader } from "../utilis/setToken";

// Request and return all hubs which are saved in the DB
export const getAllHubsFromDB = async () => {
  try{
    const requestOptions = {
      headers: authHeader()
    };
    return await axios.get('http://localhost:4500/hubs', requestOptions)
  } catch(error){
    console.log(error.message)
  }
} 

// Delete hub from DB
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

