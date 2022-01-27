import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch } from "react-redux";
import {useNavigate, Link as RouterLink } from "react-router-dom";
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Popover from '@mui/material/Popover';
import { logout } from "../../actions/userActions";
import SecurityExplanation from "./securityExplanation.js"

export default function Dashboard() {
  const dispatch = useDispatch();
  const [userName, setUserName] = useState("");

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const navigate = useNavigate();

  useEffect(()=>{
    if(userInfo){
      setUserName(userInfo.username)
    }
  }, [userInfo])

  const logoutHandler = () => {
    dispatch(logout());
  };

  const [anchorEl, setAnchorEl] = React.useState(null);

  const securityExplanationClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const securityExplanationPopupOpen = Boolean(anchorEl);
  const securityExplanationPopup = securityExplanationPopupOpen ? 'simple-popover' : undefined;

  return(
    <div>
        <h2>Welcome to Dashboard, {userName}</h2>
            <Grid container>
                <Grid item xs>
                    <Button  variant="contained" component={RouterLink} to="/users/login" onClick={logoutHandler}>
                        Log out
                    </Button>
                    
                    <Button aria-describedby={securityExplanationPopup} variant="contained" onClick={securityExplanationClick}>
                      info
                    </Button>
                    <Popover
                      id={securityExplanationPopup}
                      open={securityExplanationPopupOpen}
                      anchorEl={anchorEl}
                      onClose={handleClose}
                      anchorOrigin={{
                        vertical: 'center',
                        horizontal: 'left',
                      }}
                    >
                      <SecurityExplanation/>
                    </Popover>
                </Grid>
            </Grid>

    </div>
  );
}
