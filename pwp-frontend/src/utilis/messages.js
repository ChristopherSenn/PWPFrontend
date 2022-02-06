import React from 'react'
import Alert from '@mui/material/Alert';

// Functions for alert messages

// for errors
export const ErrorMessage = ({children}) => {
    return (
        <Alert variant="filled" severity="error" style={{fontsize:30}}>
            <strong>{children}</strong>
        </Alert>
    )
}


// success messages
export const SuccesMessage = ({children}) =>{
    return(
        <Alert severity="success">
            <strong>{children}</strong>
        </Alert>
    )
}
