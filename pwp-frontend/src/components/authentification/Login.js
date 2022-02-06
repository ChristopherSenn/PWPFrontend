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
import Loading from '../../utilis/loading';
import {ErrorMessage} from '../../utilis/messages';


// Create Material UI theme
const theme = createTheme();

export default function Login() {

    // Instantiate React navigate to easily navigate between the different pages
    const navigate = useNavigate()

    // State for username and password 
    const [formData, setFormData] = useState({
        username: "",
        password: "",

    });
    const { username, password, } = formData;

    // Use dispatch to be able to update global state
    const dispatch = useDispatch();

    // userLogin = information of user that is currenty loggedin
    const userLogin = useSelector((state) => state.userLogin);
    const { loadingBar, error, isAuth} = userLogin;
    // State of submitt button (if the button was clicked)
    const [submittButton, setSubmittButton] =useState(null)

    // Navigate to dashboard when submit button of login function was clicked
    useEffect(() => {
        if (isAuth && submittButton ) {
          navigate('/dashboard');
        }
      }, [isAuth]);

    // Update state with the user's input in the text field 
    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    // Function which is executed when user clicks on button to login after entering username and password
    const onSubmit = async (e) => {
        e.preventDefault();
        dispatch(login(username, password));
        setSubmittButton(true);
    };
    

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
                            sx={{ mt: 3, mb: 2, backgroundColor: "#3d6a66", "&:hover": { backgroundColor: '#cbc3be' } }}
                        >
                            Login
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link href="#" variant="body2">
                                    Forgot password?
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link href="/users/register" variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>

                </Box>
            </Container>
        </ThemeProvider>

    );
}