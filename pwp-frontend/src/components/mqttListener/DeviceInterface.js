import axios from 'axios'
import { authHeader } from '../../utilis/setToken';

//get the device detaila of the selected device from the database
export const getDeviceDetails = async (deviceId) => {
    try{
        //authorize for the request with the specific user token 
        const requestHeader = {
            headers: authHeader()
        };
        return await axios.get('http://localhost:4500/devices/getDeviceDetails?deviceId=' + deviceId,
        requestHeader
        )
    }catch(error){
        console.log(error.message)
      }
}

//delete device from database
export const deleteDevice = async (deviceId) => {
    try{
        //authorize for the request with the specific user token 
        const requestHeader = {
            headers: authHeader()
        };
        return await axios.delete('http://localhost:4500/devices/deleteDevice?deviceId=' + deviceId,
        requestHeader
        )
    }catch(error){
        console.log(error.message)
      }

}

//get the password for the selected hub from database
export const getHubPassword = async (hubId) => {
    try{
        //authorize for the request with the specific user token 
        const requestHeader = {
            headers: authHeader()
        };
        return await axios.get('http://localhost:4500/hubs/password?hubId=' + hubId,
        requestHeader
        )
    }catch(error){
        console.log(error.message)
      }

}