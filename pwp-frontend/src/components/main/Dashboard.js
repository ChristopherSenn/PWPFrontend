import React, { useEffect, useState } from 'react';
//import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { logout } from "../../actions/userActions";
import { getAllHubsWithoutSettingState } from "../../actions/hubsActions";
import LogoutIcon from '@mui/icons-material/Logout';
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
  const dispatchRedux = useDispatch();
  // get user name
  const [userName, setUserName] = useState("");
  //get users own hubs
  const [userHubs, setUserHubs] = useState([]);
  //get hubs, where user is a only a member
  const [userMemberHubs, setUserMemberHubs] = useState([])
  // get all information about logged user (single)
  const userLogin = useSelector((state) => state.userLogin);
  const { isAuth, user } = userLogin;



  // TO DO 
  // Wenn Hub angeklickt wird, muss hubId zurückgegeben werden --> speichern in global state  


  //users own hubs
  const showHubs = () => {

    getAllHubsWithoutSettingState().then(hubs => {
      for (const hub of hubs.data) {
        if (hub.ownerId === user.id) {
          setUserHubs([...userHubs, { hubId: hub.hubId, hubName: hub.hubName }])
        }
      }
    });
  }

  // hubs where user is member
  const showMemebersHubs = () => {
    getAllHubsWithoutSettingState().then(hubs => {
      if (isAuth && user) {
        for (const hub of hubs.data) {
          for (const memberId of hub.memberIds) {
            if (memberId === user.id && hub.ownerId !== user.id) {
              setUserMemberHubs([...userMemberHubs, { hubId: hub.hubId, hubName: hub.hubName }])
            }

          }

        }
      }
    })
  }

  useEffect(() => {
    if (user && isAuth) { //stellt sicher, dass geladen
      setUserName(user.username);
      showHubs()
      showMemebersHubs()
    }
  }, [])

  const logoutHandler = () => {
    dispatchRedux(logout());
  };


  return (
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
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
            {userMemberHubs.map((hub, index) => (
              <Grid item xs={2} sm={4} md={4} key={hub.hubId}>

                <Item onClick={(e) => alert('Device page opens')}>
                  <span>{hub.hubName}</span>
                </Item>
              </Grid>
            ))}
          </Grid>
        </Box>
        <div className='logoutButton' style={{
          position: "fixed",
          left: "94%",
          top: "20px"
        }}>
          <Button
            sx={{ backgroundColor: 'red', color: 'white', "&:hover": { backgroundColor: '#999999' } }}
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
