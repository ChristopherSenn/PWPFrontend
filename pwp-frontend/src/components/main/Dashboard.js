import React, {useEffect, useState} from 'react';
//import { useNavigate } from "react-router-dom";
import {useSelector, useDispatch } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Popover from '@mui/material/Popover';
import { getAllUsers, logout} from "../../actions/userActions";
import { getAllHubs} from "../../actions/hubsActions";
import SecurityExplanation from "./securityExplanation.js"
import Stack from '@mui/material/Stack';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import LogoutIcon from '@mui/icons-material/Logout';
import IconButton from '@mui/material/IconButton';
export default function Dashboard() {

  //const navigate = useNavigate()
  const dispatch = useDispatch();
  // get user name
  const [userName, setUserName] = useState("");
  const [userHubs, setUserHubs] = useState("");
  // get all information about logged user (single)
  const userLogin = useSelector((state) => state.userLogin);
  const { isAuth, user} = userLogin;

  // list of all users, that have an account
  //const usersList = useSelector((state) => state.users);
  const hubsList = useSelector((state) => state.hubs);
  // loading is false, if hubs are stored
  // hubs : all hubs from localstorage
  const {loading, hubs} = hubsList
  // if(isAuth){
  //   for(const hub of hubs){
  //     console.log(hub.hubName)
  //   }
  // }

    // create hubs: buttons 
    const showHubs = () => {
      const hubsButtons = [] // array for saving hubs
      console.log("userid:", user.id)
      if(isAuth){
        for(const hub of hubs){
          if(hub.ownerId === user.id){
            hubsButtons.push(
              <Button key={hub.hubId} onClick={() => console.log("works")}>
              {hubs.hubName}
            </Button>

            )}
        }
      }
      return hubsButtons;
    }
    // const fromHubToDevices = (){

    // }

  useEffect(()=>{
  dispatch(getAllHubs())
    if(user && isAuth){
      setUserName(user.username)
    }
  }, [user])

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
            <List component={Stack} direction="row" sx={{float: 'left'}}>
                 <ListItem key= 'hubsButtons' sx={{paddingRight: 3}}>
                   {showHubs()}
                 </ListItem>
               </List>
                    {/* <Button aria-describedby={securityExplanationPopup} variant="contained" onClick={securityExplanationClick}>
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
                    </Popover> */}
 
                <div className='logoutButton'>
                <Button  
                        sx={{backgroundColor: 'red', color: 'white', "&:hover": {backgroundColor: '#999999'}}}
                        variant="contained" 
                        component={RouterLink} 
                        to="/users/login" 
                        onClick={logoutHandler}
                        startIcon={<LogoutIcon />}>
                    </Button>
                </div>
            </Grid>

    </div>
  );
}
