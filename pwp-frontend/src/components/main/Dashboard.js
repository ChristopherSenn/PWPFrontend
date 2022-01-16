import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import Button from '@mui/material/Button'; 
import Grid from '@mui/material/Grid';
import { logout } from "../../actions/userActions";

export default function Dashboard() {
  const dispatch = useDispatch();
  const [userName, setUserName] = useState("");

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(()=>{
    if(userInfo){
      setUserName(userInfo.username)
    }
  }, [userInfo])

  const logoutHandler = () => {
    dispatch(logout());
  };

  return(
    <div> 
        <h2>Welcome to Dashboard, {userName}</h2>
            <Grid container>
                <Grid item xs>
                    <Button  variant="contained" component={RouterLink} to="/users/login" onClick={logoutHandler}>
                        Log out
                    </Button>
                </Grid>
            </Grid>
     
    </div>
  );
}