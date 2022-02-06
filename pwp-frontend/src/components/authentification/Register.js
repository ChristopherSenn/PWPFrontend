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
import { ErrorMessage, SuccesMessage } from '../../utilis/messages';
import Loading from '../../utilis/loading';
// Create Material UI theme
const theme = createTheme();

export default function Register() {
    // State for username, email and password. Sets the customer role per default
    const [formData, setFormData] = useState({
        email: "",
        username: "",
        password: "",
        roles: "customer"
    });
    // State for message after successful registration
    const [messageSucces, setMessageSuccess] = useState(null)
    const { email, username, password } = formData;

    // Use dispatch to be able to update global state
    const dispatch = useDispatch();
    //State with the registered user
    const userRegister = useSelector((state) => state.userRegister);

    // error saved the erorr messages; 
    // loading:bool is for progressBar 
    const { loading, error } = userRegister;

    // Update state with the user's input in the text field 
    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    // Function which is executed when user clicks on button to register after entering username, email and password
    const onSubmit = async (e) => {
        e.preventDefault();
        if (!loading) {
            dispatch(register(username, email, password, "customer"));
            setMessageSuccess("Registration Successful.")
        }

    };

    // Alert message to provide user with feedback if registration was successful or not
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
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}></Avatar>
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
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2, backgroundColor: "#3d6a66", "&:hover": { backgroundColor: '#cbc3be' }  }}
                        >
                            Sign Up
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link href="/users/login" variant="body2">
                                    Already have an account? Login
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>

    );
}