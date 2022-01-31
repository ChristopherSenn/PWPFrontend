import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { logout } from "../../actions/userActions";
import { getAllHubsWithoutSettingState } from "../../actions/hubsActions";
import LogoutIcon from '@mui/icons-material/Logout';
import Paper from '@mui/material/Paper';
import { experimentalStyled as styled } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import { HUB_CLICKED } from '../../actions/types';
import AddIcon from '@mui/icons-material/Add';

export default function Dashboard() {

  const navigate = useNavigate();

  const dispatch = useDispatch();
  // get user name
  const [userName, setUserName] = useState("");
  //get users own hubs
  const [ownerHubs, setOwnerHubs] = useState([]);
  //get hubs, where user is a only a member
  const [userMemberHubs, setUserMemberHubs] = useState([])
  // get all information about logged user (single)
  const userLogin = useSelector((state) => state.userLogin);
  const { isAuth, user } = userLogin;

  // hubCLicked contains the id of the hub that was clicked
  //const hubClicked = useSelector((state) => state.hubClicked)

  let ownerHubsArray = [];
  //users own hubs
  const showHubs = () => {

    getAllHubsWithoutSettingState().then(hubs => {
      for (const hub of hubs.data) {
        if (hub.ownerId === user.id) {
          // Klappt nicht: Warum auch immer?! 
          // setOwnerHubs([...ownerHubs,[{ hubId: hub.hubId, hubName: hub.hubName }]])
          ownerHubsArray.push({ hubId: hub.hubId, hubName: hub.hubName });
        }
        setOwnerHubs(ownerHubsArray)
      }
    });
  }

  // hubs where user is member
  const showMemebersHubs = () => {
    let memberHubsArray = []
    getAllHubsWithoutSettingState().then(hubs => {
      if (isAuth && user) {
        for (const hub of hubs.data) {
          for (const memberId of hub.memberIds) {
            if (memberId === user.id && hub.ownerId !== user.id) {
              // Klappt ?! 
              //setUserMemberHubs([...userMemberHubs, { hubId: hub.hubId, hubName: hub.hubName }])
              memberHubsArray.push({ hubId: hub.hubId, hubName: hub.hubName });
            }

          }

        }
        setUserMemberHubs(memberHubsArray)
      }
    })
  }

  useEffect(() => {
    if (user && isAuth) { //stellt sicher, dass geladen
      setUserName(user.username)
      showHubs()
      showMemebersHubs()
    }
  }, [user])

  const logoutHandler = () => {
    dispatch(logout());
  };

  // Styling of items in which each hub is displayed
  const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: 'center',
    cursor: 'pointer',
  }));

  return (
    <div>
      <h2>Welcome to Dashboard, {userName}</h2>
      <Button
        aria-label="delete"
        size="large"
        sx={{ color: 'white', "&:hover": { backgroundColor: '#999999' } }}
        variant="contained"
        component={RouterLink}
        to="/add-hub"
        startIcon={<AddIcon fontSize="inherit" />}>
        hub
      </Button>
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      ></Box>
      <span>
        Hubs you own:
      </span>
      <Box
        sx={{
          marginTop: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      ></Box>

      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
          {ownerHubs.map((hub, index) => (
            <Grid item xs={2} sm={4} md={4} key={index}>

              <Item onClick={(e) => {
                alert('Device page opens');
                navigate('/dashboard');
                dispatch({ type: HUB_CLICKED, payload: hub.hubId })
              }}
                sx={{ backgroundColor: '#ddfada' }}>
                <span>{hub.hubName}</span>
              </Item>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box
        sx={{
          marginTop: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      ></Box>

      <Divider />

      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      ></Box>
      <span>
        Hubs you are a member of:
      </span>
      <Box
        sx={{
          marginTop: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      ></Box>

      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
          {userMemberHubs.map((hub, index) => (
            <Grid item xs={2} sm={4} md={4} key={hub.hubId}>

              <Item
                onClick={(e) => {
                  navigate('/deviceOverview');
                  dispatch({ type: HUB_CLICKED, payload: hub.hubId })

                }}
                sx={{ backgroundColor: 'lightgrey' }}>
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

    </div>
  );
}
