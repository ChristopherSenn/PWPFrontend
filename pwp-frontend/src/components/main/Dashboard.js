import React, {useEffect} from 'react';
import axios from 'axios';


export default function Dashboard() {


  useEffect(()=>{
    
    const config = {
      headers:{
        authorization :localStorage.getItem('token')
      }
    }
    axios.get('http://localhost:4500/users', config).
    then(res=>
      {
        console.log(res)
      },
    
      err => console.log(err))
  })
  return(
    <h2>Welcome to Dashboard</h2>
  );
}