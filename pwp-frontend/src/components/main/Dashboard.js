import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
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
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function Dashboard() {

  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  // hubCLicked contains the id of the hub that was clicked
  //const hubClicked = useSelector((state) => state.hubClicked)

  //users own hubs
  const showHubs = () => {

    let ownerHubsArray = [];
    let memberHubsArray = [];
    
    getAllHubsFromDB().then(hubs => {

      hubs.data.forEach((hub, i) => {
        if (hub.ownerId === user.id) {
          // Klappt nicht: Warum auch immer?! 
          // setOwnerHubs([...ownerHubs,[{ hubId: hub.hubId, hubName: hub.hubName }]])
          ownerHubsArray.push({ hubId: hub.hubId, hubName: hub.hubName, memberIds: hub.memberIds, ownerId: hub.ownerId});
        }
        setOwnerHubs(ownerHubsArray)
        hub.memberIds.forEach(member => {
          if (member === user.id && hub.ownerId !== user.id) {
            // Klappt ?! 
            //setUserMemberHubs([...userMemberHubs, { hubId: hub.hubId, hubName: hub.hubName }])
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
      if(elem !== hub) {
        tempHubArr.push(elem);
      }
    })  
    setOwnerHubs(tempHubArr);
    setOpen(false)
  }

  const onEdit = (e, hub) => {
    // navigates to edit-hub and passes information about which hub was clicked
    navigate('/edit-hub', { state: hub});
  }

  // Styling of items in which each hub is displayed
  const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: 'center',
    cursor: 'pointer',
  }));

  if(ownerHubs.length > 0 && userMemberHubs.length > 0) {
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
                <Box sx={{ textAlign: 'right' }}>
                  <IconButton onClick={(e) => onEdit(e, hub)} >
                    <GroupAddIcon />
                  </IconButton>
                  <IconButton aria-label="delete" onClick={handleClickOpen}>
                    <DeleteIcon />
                  </IconButton>
                  <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                  >
                    <DialogTitle id="alert-dialog-title">
                      {"Delete Hub"}
                    </DialogTitle>
                    <DialogContent>
                      <DialogContentText id="alert-dialog-description">
                        Do you really want to delete this hub?
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button sx={{ backgroundColor: '#787878', color: 'white', "&:hover": { backgroundColor: '#999999' } }} onClick={handleClose}>No</Button>
                      <Button sx={{ backgroundColor: '#787878', color: 'white', "&:hover": { backgroundColor: '#999999' } }} onClick={(e) => onDelete(e, hub)} autoFocus>
                        Yes
                      </Button>
                    </DialogActions>
                  </Dialog>
                </Box>
                <Item onClick={(e) => {
                  /* alert('Device page opens'); */
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
                    alert('Device page opens');
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
  )} else if(ownerHubs.length > 0 && userMemberHubs.length === 0) {
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
                  <Box sx={{ textAlign: 'right'}}>
                      <IconButton onClick={(e) => onEdit(e, hub)} >
                            <GroupAddIcon />
                      </IconButton>
                      <IconButton onClick={(e) => onDelete(e, hub)} >
                            <DeleteIcon />
                      </IconButton>
                  </Box>
                  <Item onClick={(e) => {
                    /* alert('Device page opens'); */
                    dispatch({ type: HUB_CLICKED, payload: hub.hubId })
                  }}
                    sx={{ backgroundColor: '#ddfada' }}>
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
      )
    }
  else if(ownerHubs.length === 0 && userMemberHubs.length > 0) {
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
                    alert('Device page opens');
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
  )}
  else {
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
            sx={{ backgroundColor: 'red', color: 'white', "&:hover": { backgroundColor: '#999999' } }}
            variant="contained"
            component={RouterLink}
            to="/users/login"
            onClick={logoutHandler}
            startIcon={<LogoutIcon />}>
          </Button>
        </div>
  
      </div>
  )}
}
