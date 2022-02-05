import axios from 'axios'
import { authHeader } from '../../utilis/setToken';


//get all the devices contained in the selected hub from the database
export const getDevicesByHub = async (selectedHubId) => {
    try{
        //authorize for the request with the specific user token 
        const requestHeader = {
            headers: authHeader()
        };
        return await axios.get('http://pwp21.medien.ifi.lmu.de/devices/getDeviceByHub?hubId=' + selectedHubId,
        requestHeader
        )
    }catch(error){
        console.log(error.message)
      }
}