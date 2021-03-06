import axios from 'axios'
import { authHeader } from '../../utilis/setToken';


//get all the devices contained in the selected hub from the database
export const getDevicesByHub = async (selectedHubId) => {
    try{
        //authorize for the request with the specific user token 
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