import React, {useEffect, useState} from 'react';
import Container from '@mui/material/Container';

export default function SecurityExplanation() {
  return(
    <div className='SecurityExplanation'>
      <Container sx={{color: 'white', backgroundColor: '#787878', fontFamily: 'Arial'}}>
        <h2>No connection</h2>
        <p>All connections to the device are blocked. Note that also this dashboard will not be avaible in this mode.</p>

        <h2>Access point only</h2>
        <p>The device will be accessible only thorugh it's supplied wifi. No connections to networks are possible.</p>

        <h2>Local network only</h2>
        <p>Only device within the same network as the device will be able to access it.</p>

        <h2>Full internet access</h2>
        <p>The device will establish an internet connection and will be accessible from all endpoints its registered to.</p>
      </Container>
    </div>
  );
}
