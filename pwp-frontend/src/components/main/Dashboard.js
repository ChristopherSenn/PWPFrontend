import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { logout } from "../../actions/userActions";
import LogoutIcon from '@mui/icons-material/Logout';
import Divider from '@mui/material/Divider';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import DevicesAll from '../deviceManager/DevicesAll';

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


export default function Dashboard() {

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [userName, setUserName] = useState("");

  const userLogin = useSelector((state) => state.userLogin);
  const { isAuth, user } = userLogin;

  useEffect(() => {
    if (user && isAuth) { //stellt sicher, dass geladen
      setUserName(user.username)
    }
  }, [user])

  const logoutHandler = () => {
    dispatch(logout());
  };


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
        }}
      ></Box>
      <Typography variant="h5" sx={{ marginLeft: '14px', marginRight: '89%', color: '#69849b', fontWeight: "bolder" }}>
        Devices in your local network:
      </Typography>

      <DevicesAll/>

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
