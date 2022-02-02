import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { logout } from "../../actions/userActions";
import { getAllHubsFromDB, deleteHub } from "../../actions/hubsActions";
import LogoutIcon from '@mui/icons-material/Logout';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import { experimentalStyled as styled } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import { HUB_CLICKED } from '../../actions/types';
import AddIcon from '@mui/icons-material/Add';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  
  components: {
    MuiCssBaseline: {
      styleOverrides: 
        `@font-face {
          font-family: 'Arial';
          font-style: normal;
        }`,
      
    },
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: "#3d6a66",
        },
      },
    },
   MuiTypography:{
     styleOverrides:{
       root:{
         textAlign: 'center',
         marginTop: '30px'
       },
     },
   },
  },
})
 // Styling of items in which each hub is displayed
 const Item1 = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  cursor: 'pointer',
  backgroundColor: '#69849b',
  color: 'white'
  }));
   // Styling of items in which each hub is displayed
 const Item2 = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  cursor: 'pointer',
  backgroundColor: '#a8c7cb',
  }));

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


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

  const [open, setOpen] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };


  // hubCLicked contains the id of the hub that was clicked
  const hubClicked = useSelector((state) => state.hubClicked)

  //users own hubs
  const showHubs = () => {

    let ownerHubsArray = [];
    let memberHubsArray = [];

    getAllHubsFromDB().then(hubs => {

      hubs.data.forEach((hub, i) => {
        if (hub.ownerId === user.id) {
          ownerHubsArray.push({ hubId: hub.hubId, hubName: hub.hubName, memberIds: hub.memberIds, ownerId: hub.ownerId, password: hub.password });
        }
        setOwnerHubs(ownerHubsArray)
        hub.memberIds.forEach(member => {
          if (member === user.id && hub.ownerId !== user.id) {
            memberHubsArray.push({ hubId: hub.hubId, hubName: hub.hubName });
          }
        })
      })
      setUserMemberHubs(memberHubsArray)
    });
  }

  useEffect(() => {
    if (user && isAuth) { //stellt sicher, dass geladen
      setUserName(user.username)
      showHubs()
    }
  }, [user])

  const logoutHandler = () => {
    dispatch(logout());
  };

  const onDelete = (e, hub) => {
    deleteHub(hub.hubId);

    const tempHubArr = [];
    ownerHubs.forEach(elem => {
      if (elem !== hub) {
        tempHubArr.push(elem);
      }
    })
    setOwnerHubs(tempHubArr);
    setOpen(true);
  }

  const onEdit = (e, hub) => {
    // navigates to edit-hub and passes information about which hub was clicked
    navigate('/edit-hub', { state: hub });
  }

 


  
  if(ownerHubs.length > 0 && userMemberHubs.length > 0) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Typography variant="h4"  component="div">
       Hi, {userName}!
      </Typography>
        <Button
          aria-label="delete"
          size="large"
          sx={{ color: 'white', "&:hover": { backgroundColor: '#999999' }, marginLeft: '15px' }}
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
        <Typography  variant="h5" style={{  marginLeft: '14px', marginRight: '89%', color: '#69849b', fontWeight: "bolder"}}>
          Hubs you own:
        </Typography>
        <Box
          sx={{
            marginTop: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        ></Box>

        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          p: 1,
          m: 1,
          borderRadius: 1,
        }}>
          <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>

            {ownerHubs.map((hub, index) => (
              <Grid item xs={2} sm={4} md={4} key={index}>
                <Box sx={{ textAlign: 'right' }}>
                  <IconButton onClick={(e) => onEdit(e, hub)} >
                    <GroupAddIcon />
                  </IconButton>
                  <IconButton aria-label="delete" onClick={(e) => onDelete(e, hub)}>
                    <DeleteIcon />
                  </IconButton>
                  <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                      Hub was successfully deleted
                    </Alert>
                  </Snackbar>
                </Box>
                <Item1 onClick={(e) => {
                  navigate('/deviceOverview');
                  dispatch({ type: HUB_CLICKED, payload: hub.hubId })
                }}>
                  <span>{hub.hubName}</span>
                </Item1>
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
       <Typography  variant="h5" style={{ marginLeft: '15px', marginRight: '82%', color: '#a8c7cb', fontWeight: "bolder"}}>
          Hubs you are a member of :
        </Typography>
        <Box
          sx={{
            marginTop: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        ></Box>

        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          p: 1,
          m: 1,
          borderRadius: 1,
        }}>
          <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
            {userMemberHubs.map((hub, index) => (
              <Grid item xs={2} sm={4} md={4} key={hub.hubId}>

                <Item2
                  onClick={(e) => {
                    navigate('/deviceOverview');
                    dispatch({ type: HUB_CLICKED, payload: hub.hubId })

                  }}>
                  <span>{hub.hubName}</span>
                </Item2>
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
            sx={{ backgroundColor: 'gray', color: 'white', "&:hover": { backgroundColor: '#999999' } }}
            variant="contained"
            component={RouterLink}
            to="/users/login"
            onClick={logoutHandler}
            startIcon={<LogoutIcon />}>
          </Button>
        </div>

      </ThemeProvider>
    )
  } else if (ownerHubs.length > 0 && userMemberHubs.length === 0) {
    return (
      <ThemeProvider theme={theme}>
      <CssBaseline />
      <Typography variant="h5"  component="div">
     Hi, {userName}!
    </Typography>
        <Button
          aria-label="delete"
          size="large"
          sx={{ color: 'white', "&:hover": { backgroundColor: '#999999' }, marginLeft: '15px' }}
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
          <Typography  variant="h5" style={{  marginLeft: '14px', marginRight: '89%', color: '#69849b', fontWeight: "bolder"}}>
          Hubs you own:
        </Typography>
        <Box
          sx={{
            marginTop: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        ></Box>

        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          p: 1,
          m: 1,
          borderRadius: 1,
        }}>
          <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>

            {ownerHubs.map((hub, index) => (
              <Grid item xs={2} sm={4} md={4} key={index}>
                <Box sx={{ textAlign: 'right' }}>
                  <IconButton onClick={(e) => onEdit(e, hub)} >
                    <GroupAddIcon />
                  </IconButton>
                  <IconButton onClick={(e) => onDelete(e, hub)} >
                    <DeleteIcon />
                  </IconButton>
                </Box>
                <Item1 onClick={(e) => {
               
                  dispatch({ type: HUB_CLICKED, payload: hub.hubId })
                }}
                  >
                  <span>{hub.hubName}</span>
                </Item1>
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
            sx={{ backgroundColor: 'gray', color: 'white', "&:hover": { backgroundColor: '#999999' } }}
            variant="contained"
            component={RouterLink}
            to="/users/login"
            onClick={logoutHandler}
            startIcon={<LogoutIcon />}>
          </Button>
        </div>
      </ThemeProvider>
    )
  }
  else if (ownerHubs.length === 0 && userMemberHubs.length > 0) {
    return (
      <ThemeProvider theme={theme}>
      <CssBaseline />
      <Typography variant="h5"  component="div">
     Hi, {userName}!
    </Typography>
        <Button
          aria-label="delete"
          size="large"
          sx={{ color: 'white', "&:hover": { backgroundColor: '#999999' }, marginLeft: '15px' }}
          variant="contained"
          component={RouterLink}
          to="/add-hub"
          startIcon={<AddIcon fontSize="inherit" />}>
          hub
        </Button>

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
          <Typography  variant="h5" style={{ marginLeft: '15px', marginRight: '82%', color: '#a8c7cb', fontWeight: "bolder"}}>
          Hubs you are a member of :
        </Typography>
        <Box
          sx={{
            marginTop: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        ></Box>

        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          p: 1,
          m: 1,
          borderRadius: 1,
        }}>
          <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
            {userMemberHubs.map((hub, index) => (
              <Grid item xs={2} sm={4} md={4} key={hub.hubId}>

                <Item2
                  onClick={(e) => {
                    navigate('/deviceOverview');
                    dispatch({ type: HUB_CLICKED, payload: hub.hubId })

                  }}
                  sx={{ backgroundColor: 'lightgrey' }}>
                  <span>{hub.hubName}</span>
                </Item2>
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
            sx={{ backgroundColor: 'gray', color: 'white', "&:hover": { backgroundColor: '#999999' } }}
            variant="contained"
            component={RouterLink}
            to="/users/login"
            onClick={logoutHandler}
            startIcon={<LogoutIcon />}>
          </Button>
        </div>

      </ThemeProvider>
    )
  }
  else {
    return (
      <ThemeProvider theme={theme}>
      <CssBaseline />
      <Typography variant="h5"  component="div">
     Hi, {userName}!
    </Typography>
        <Button
          aria-label="delete"
          size="large"
          sx={{ color: 'white', "&:hover": { backgroundColor: '#999999' }, marginLeft: '15px' }}
          variant="contained"
          component={RouterLink}
          to="/add-hub"
          startIcon={<AddIcon fontSize="inherit" />}>
          hub
        </Button>

        <Box
          sx={{
            marginTop: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        ></Box>
        <div className='logoutButton' style={{
          position: "fixed",
          left: "94%",
          top: "20px"
        }}>
          <Button
            sx={{ backgroundColor: 'gray', color: 'white', "&:hover": { backgroundColor: '#999999' } }}
            variant="contained"
            component={RouterLink}
            to="/users/login"
            onClick={logoutHandler}
            startIcon={<LogoutIcon />}>
          </Button>
        </div>

      </ThemeProvider>
    )
  }
}
