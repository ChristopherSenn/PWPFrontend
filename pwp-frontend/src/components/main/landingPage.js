import React from 'react'
import { Link as RouterLink } from "react-router-dom";
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';


export default function LandingPage() {
    return (
        <div>
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
                    <Typography component="h1" variant="h5">
                        Smart Home App
                    </Typography>
                    <Grid container>
                        <Grid item xs>
                            <Button fullWidth variant="contained" component={RouterLink} to="/users/login">
                                Login
                            </Button>
                        </Grid>
                        <Grid item xs>
                            <Button fullWidth variant="outlined" component={RouterLink} to="/users/register">
                                Sign Up
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </div>
    )
}
