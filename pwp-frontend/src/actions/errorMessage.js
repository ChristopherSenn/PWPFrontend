import React from 'react'
import Alert from '@mui/material/Alert';


const ErrorMessage = ({children}) => {
    return (
        <Alert variant="filled" severity="error" style={{fontsize:30}}>
            <strong>{children}</strong>
        </Alert>
    )
}
export default ErrorMessage;