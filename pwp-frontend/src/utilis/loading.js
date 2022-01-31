import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
// function to show the progressbar
export default function Loading() {

    return (
        <div style = {{
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
            width: "100%",
            height: "100%",
        }}>
            <CircularProgress 
            style={{
                width:100,
                height:100,
                }}
            color="secondary" 
            disableShrink />;
        </div>

    );
}