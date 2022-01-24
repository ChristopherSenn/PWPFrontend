import React from 'react'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { experimentalStyled as styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import CoffeeIcon from '@mui/icons-material/Coffee';
import Avatar from '@mui/material/Avatar';

import deviceDummyData from './deviceDummyData.json';


const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  cursor: 'pointer',
  elevation: 0,
}));


export default function DevicesLocalNetwork() {
    return (
    <>
        <Box
            sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        ></Box>
        <Typography component="h1" variant="h5" align="center">
            Devices in your local network
        </Typography>
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
            {Array.from(deviceDummyData).map((device, index) => (
            <Grid item xs={2} sm={4} md={4} key={index}>

                <Item elevation={0} onClick={(e) => alert('Device page opens')}>
                    <Avatar style={{margin: 'auto', backgroundColor:'white', border: '1px solid lightgrey'}}> 
                        <CoffeeIcon color={device.status.connection}/>  
                    </Avatar> 
                    <br></br>           
                    <span>{device.deviceName}</span>
                </Item> 
            </Grid>
            ))}
        </Grid>
        </Box> 
    </>
    );
}