import React  from 'react';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function SecurityExplanation() {
  return(
    <div className='SecurityExplanation'>
      <Alert severity="info" sx={{color:"#3b4834", backgroundColor: '#e0e8e5', fontFamily: 'Arial'}}>
        <h2>No connection</h2>
        <h3>All connections to the device are blocked. Note that also this dashboard will not be avaible in this mode.</h3>

        <h2>Access point only</h2>
        <h3>The device will be accessible only thorugh it's supplied wifi. No connections to networks are possible.</h3>

        <h2>Local network only</h2>
        <h3>Only device within the same network as the device will be able to access it.</h3>

        <h2>Full internet access</h2>
        <h3>The device will establish an internet connection and will be accessible from all endpoints its registered to.</h3>
      </Alert>
    </div>
  );
}
