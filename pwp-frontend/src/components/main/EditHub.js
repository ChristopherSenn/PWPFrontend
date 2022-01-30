import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

export default function EditHub() {

    const { state } = useLocation();
    // contains the information about the clicked hub
    console.log(state); 
    
    const navigate = useNavigate();
    

    const cancelButtonHandler = () => {
        navigate('/dashboard');
    }


    return (
    <Container component="main" maxWidth="xs">
        <Typography component="h1" variant="h5"  sx={{ mt: 1, alignItems: 'center'}}>
            Edit Hub
        </Typography>

            <Button
            onClick={cancelButtonHandler}
            fullWidth
            variant="outlined"
            sx={{ mt: 1 }}
            >
            Cancel
            </Button>
    </Container>
    )
}