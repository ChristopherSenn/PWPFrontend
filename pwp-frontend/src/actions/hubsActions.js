import axios from 'axios'
import { authHeader } from "../utilis/setToken";


export const getAllHubsFromDB = async () => {
  try{
    const requestOptions = {
      headers: authHeader()
    };
    return await axios.get('https://pwp21.medien.ifi.lmu.de/hubs', requestOptions)
  } catch(error){
    console.log(error.message)
  }
} 

export const deleteHub = async (hubId) => {
  try{
    return await axios.delete('https://pwp21.medien.ifi.lmu.de/hubs/deleteHub', {
      headers: authHeader(),
      data: {
        "hubId": hubId
      }
    });
  } catch(error){
    console.log(error.message)
  }
}

