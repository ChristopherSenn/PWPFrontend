import React, {useEffect, useState} from 'react';
import {useSelector } from "react-redux";


export default function Dashboard() {

  const [userName, setUserName] = useState("");

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(()=>{
    if(userInfo){
      setUserName(userInfo.username)
    }
  }, [userInfo])


  return(
    <h2>Welcome to Dashboard, {userName}</h2>
  );
}