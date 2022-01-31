import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { register } from "../../actions/userActions";
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
import './Register.css'
import { ErrorMessage, SuccesMessage } from '../../utilis/messages';
import Loading from '../../utilis/loading';

const theme = createTheme();

export default function Register() {
    // formData saves the inputs of users
    const [formData, setFormData] = useState({
        email: "",
        username: "",
        password: "",
        roles: "customer"
    });
    // state for succesfully messages
    const [messageSucces, setMessageSuccess] = useState(null)
    const { email, username, password } = formData;

    const dispatch = useDispatch();
    //state with the registered user
    const userRegister = useSelector((state) => state.userRegister);

    console.log(userRegister);

    //error saved the erorr messages; 
    // loading:bool is an is for progressBar 
    const { loading, error } = userRegister;

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!loading) {
            dispatch(register(username, email, password, "customer"));
            setMessageSuccess("Registration Successful.")
        }

    };
    const setAlertMessage = () => {
        if (error) {
            return <ErrorMessage>{error}</ErrorMessage>
        } else if (messageSucces) {
            return <SuccesMessage>
                {messageSucces}
                <Link href="/users/login" variant="body2">
                    Please click here to Login
                </Link>
            </SuccesMessage>
        }
    }


    return (
        <header className="SignUp-header">
        <div className="SignUpContent"> 
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        height: 590,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: "center"
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: '#787878' }}></Avatar>
                    <Typography component="h1" variant="h5">
                        Sign up
                    </Typography>
                    {loading && <Loading />}
                    {setAlertMessage()}
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
                            id="email"
                            label="Email Address"
                            name="email"
                            value={email}
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
                            Sign In
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link href="/users/login" variant="body2" sx={{ color: 'white', textDecoration: 'none' }}>
                                    Already have an account? Login
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