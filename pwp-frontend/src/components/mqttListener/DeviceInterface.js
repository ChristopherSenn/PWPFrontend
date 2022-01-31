import axios from 'axios'
import { authHeader } from '../../utilis/setToken';

export const getDeviceDetails = async (deviceId) => {
    try{
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