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
import DeviceOverview from '../deviceManager/DeviceOverview';

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
    MuiTypography: {
      styleOverrides: {
        root: {
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
  const [userMemberHubs, setUserMemberHubs] = useState([]);
  const [cssVisibilityItem1, setCssVisibilityItem1] = useState('none');
  const [cssVisibilityItem2, setCssVisibilityItem2] = useState('none');
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

  //users own hubs
  // const showHubs = () => {
  //
  //   let ownerHubsArray = [];
  //   let memberHubsArray = [];
  //
  //   getAllHubsFromDB().then(hubs => {
  //
  //     hubs.data.forEach((hub, i) => {
  //       if (hub.ownerId === user.id) {
  //         ownerHubsArray.push({ hubId: hub.hubId, hubName: hub.hubName, memberIds: hub.memberIds, ownerId: hub.ownerId, password: hub.password });
  //       }
  //       setOwnerHubs(ownerHubsArray)
  //       hub.memberIds.forEach(member => {
  //         if (member === user.id && hub.ownerId !== user.id) {
  //           memberHubsArray.push({ hubId: hub.hubId, hubName: hub.hubName });
  //         }
  //       })
  //     })
  //     setUserMemberHubs(memberHubsArray)
  //
  //     // Change css classes to update the displayed headings accordingly
  //     if (ownerHubsArray.length > 0 && memberHubsArray.length > 0) {
  //       setCssVisibilityItem1('block');
  //       setCssVisibilityItem2('block');
  //     } else if (ownerHubsArray.length > 0 && memberHubsArray.length === 0) {
  //       setCssVisibilityItem1('block');
  //       setCssVisibilityItem2('none');
  //     } else if (ownerHubsArray.length === 0 && memberHubsArray.length > 0) {
  //       setCssVisibilityItem1('none');
  //       setCssVisibilityItem2('block');
  //     } else if (ownerHubsArray.length === 0 && memberHubsArray.length === 0) {
  //       setCssVisibilityItem1('none');
  //       setCssVisibilityItem2('none');
  //     }
  //   });
  // }

  useEffect(() => {
    if (user && isAuth) { //stellt sicher, dass geladen
      setUserName(user.username)
      // showHubs()
    }
  }, [user])

  const logoutHandler = () => {
    dispatch(logout());
  };

  // const onDelete = (e, hub) => {
  //   deleteHub(hub.hubId);
  //
  //   const tempHubArr = [];
  //   ownerHubs.forEach(elem => {
  //     if (elem !== hub) {
  //       tempHubArr.push(elem);
  //     }
  //   })
  //   setOwnerHubs(tempHubArr);
  //   setOpen(true);
  //
  //   // Change css classes to update the displayed headings accordingly
  //   if (tempHubArr.length > 0) {
  //     setCssVisibilityItem1('block');
  //   } else {
  //     setCssVisibilityItem1('none');
  //   }
  // }

  // const onEdit = (e, hub) => {
  //   // navigates to edit-hub and passes information about which hub was clicked
  //   navigate('/edit-hub', { state: hub });
  // }





  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Typography variant="h4" component="div">
        Hi, {userName}!
      </Typography>

      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          display: `${cssVisibilityItem1}`,
        }}
      ></Box>
      <Typography variant="h5" sx={{ marginLeft: '14px', marginRight: '89%', color: '#69849b', fontWeight: "bolder" }}>
        Devices in your local network:
      </Typography>


      <DeviceOverview/>



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
