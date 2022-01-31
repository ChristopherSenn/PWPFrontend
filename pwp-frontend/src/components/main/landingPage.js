import React from 'react'
import { Link as RouterLink } from "react-router-dom";
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import './landingPage.css'



export default function LandingPage() {
    return (
        <header className="LandingPage-header">
            <div className="LandingPageContent"> 
            <Container component="main" maxWidth="xs" sx={{
                        alignItems: 'center',
                        justifyContent: "center"
                    }}>
                <CssBaseline />
                <Box
                    sx={{
                        height: 500,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: "center"
                    }}
                >
                    <h2>
                        Smart Home App
                    </h2>
                    <Grid container>
                        <Grid item xs>
                            <Button fullWidth variant="contained" component={RouterLink} to="/users/login" sx={{backgroundColor: '#787878', color: 'white', "&:hover": {backgroundColor: '#999999'}}}>
                                Login
                            </Button>
                        </Grid>
                        <Grid item xs>
                        <Button fullWidth variant="outlined" component={RouterLink} to="/users/register" sx={{borderColor: '#787878', color: '#787878', "&:hover": {backgroundColor: '#999999'}}}>
                                Sign Up
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
            </div>
            </header>
    )
}
