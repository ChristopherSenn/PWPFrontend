import React, {useEffect, useState} from 'react';
//import { useNavigate } from "react-router-dom";
import {useSelector, useDispatch } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import { getAllUsers, logout} from "../../actions/userActions";
import { getAllHubs, getAllHubsWithoutSettingState} from "../../actions/hubsActions";
import SecurityExplanation from "./securityExplanation.js"
import Stack from '@mui/material/Stack';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import LogoutIcon from '@mui/icons-material/Logout';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';

import { experimentalStyled as styled } from '@mui/material/styles';


const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  cursor: 'pointer',
}));


export default function Dashboard() {

  //const navigate = useNavigate()
  const dispatch = useDispatch();
  // get user name
  const [userName, setUserName] = useState("");
  const [userHubs, setUserHubs] = useState([]);

  // get all information about logged user (single)
  const userLogin = useSelector((state) => state.userLogin);
  const { isAuth, user} = userLogin;

  // list of all users, that have an account
  //const usersList = useSelector((state) => state.users);
  const hubs = useSelector((state) => state.hubs);
  // hubs : all hubs from localstorage
  
  // TO DO Hubs in denen man Mitglied ist user.userId === hub.memberId
  // Wenn Hub angeklickt wird, muss hubId zurückgegeben werden --> speichern in global state      
  const showHubs = () => {

    getAllHubsWithoutSettingState().then(hubs => {
      for(const hub of hubs.data){
        if(hub.ownerId === user.id){
          setUserHubs([...userHubs, {hubId: hub.hubId, hubName: hub.hubName}]) 
        }
      }
    });
  }

  useEffect(()=>{
    if(user && isAuth){ //stellt sicher, dass geladen
      setUserName(user.username);
      showHubs();
    }
  }, [])

  const logoutHandler = () => {
    dispatch(logout());
  };

  const [anchorEl, setAnchorEl] = useState(null);

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
            <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
              {userHubs.map((hub, index) => (
              <Grid item xs={2} sm={4} md={4} key={index}>

                  <Item onClick={(e) => alert('Device page opens')}>         
                     <span>{hub.hubName}</span>
                  </Item> 
              </Grid>
              ))}
              </Grid>
            </Box>
            {/* <List component={Stack} direction="row" sx={{float: 'left'}}>
                 <ListItem key= 'hubsButtons' sx={{paddingRight: 3}}>
                   {showHubs()}
                 </ListItem>
            </List> */}
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
