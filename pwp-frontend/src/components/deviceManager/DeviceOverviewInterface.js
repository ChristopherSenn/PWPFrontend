import axios from 'axios'
import { authHeader } from '../../utilis/setToken';

export const getDevicesByHub = async (selectedHubId) => {
    try{
        const requestHeader = {
            headers: authHeader()
        };
        return await axios.get('http://localhost:4500/devices/getDeviceByHub?hubId=' + selectedHubId,
        requestHeader
        )
    }catch(error){
        console.log(error.message)
      }
}