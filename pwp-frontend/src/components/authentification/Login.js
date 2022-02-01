import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../actions/userActions";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import './Login.css'
import Loading from '../../utilis/loading';
import {ErrorMessage} from '../../utilis/messages';

const theme = createTheme();

export default function Login() {

    const navigate = useNavigate()
    // formData saves the inputs of users
    const [formData, setFormData] = useState({
        username: "",
        password: "",

    });
    const { username, password, } = formData;
    const dispatch = useDispatch();
    // userLogin = information of user that are currenty loggedin
    const userLogin = useSelector((state) => state.userLogin);
    const { loadingBar, error, isAuth} = userLogin;
    // state for submittButton (if the button was clicked)
    const [submittButton, setSubmittButton] =useState(null)

    useEffect(() => {
        if (isAuth && submittButton ) {
          navigate('/dashboard');
        }
      }, [isAuth]);
    // update state with userinputs
    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        dispatch(login(username, password));
        setSubmittButton(true);
    };
    

    return (
        <header className="Login-header">
        <div className="LoginContent"> 
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        height: 550,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: "center"
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: '#787878' }}></Avatar>
                    <Typography component="h1" variant="h5">
                        Login
                    </Typography>
                    {error && <ErrorMessage>{error}</ErrorMessage>}
                    {loadingBar && <Loading/>}
                    <Box component="form" onSubmit={(e) => onSubmit(e)} sx={{ mt: 1 }}>
                        <TextField
                            required
                            type="text"
                            id="text"
                            label="User Name"
                            fullWidth
                            name="username"
                            value={username}
                            onChange={(e) => onChange(e)}
                            sx={{borderColor: '#787878', color: '#787878', "&:hover": {backgroundColor: '#787878'}}}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => onChange(e)}
                            sx={{borderColor: '#787878', color: '#787878', "&:hover": {backgroundColor: '#787878'}}}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2, backgroundColor: '#787878', color: 'white', "&:hover": {backgroundColor: '#999999'} }}
                        >
                            Login
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link href="#" variant="body2" sx={{ color: 'white', textDecoration: 'none' }}>
                                    Forgot password?
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link href="/users/register" variant="body2" sx={{ color: 'white', textDecoration: 'none' }}>
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                        
                    </Box>

                </Box>
            </Container>
        </ThemeProvider>
        </div>
        </header>

    );
}