import React, { useState, useEffect } from 'react';
import './DeviceOverview.css'
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import Stack from '@mui/material/Stack';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { getDevicesByHub } from './DeviceOverviewInterface'
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";






// class AddDevice extends React.Component{
//     render(){
//         return (
//             <div className='AddDevice'>
//                 <IconButton aria-label="delete" size="large" sx={{backgroundColor: '#787878', color: 'white', "&:hover": {backgroundColor: '#999999'}}} >
//                   <AddIcon fontSize="inherit" />
//                 </IconButton> 
//             </div>
//         )
//     }

// }




class DeviceButtons extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            deviceName: "Your Device",
            deviceId: "The deviceId"
        };
    }

    componentDidMount() {
        this.setState({ deviceName: this.props.deviceName });
        this.setState({ deviceId: this.props.deviceId })
    }

    render() {
        return (
            <div className="DeviceButtons">
                <Button sx={{ color: 'white', backgroundColor: '#787878', width: 200, height: 70, "&:hover": { backgroundColor: '#999999' } }}
                    onClick={(e) => {
                        this.props.handleDeviceSelected(this.state.deviceId);
                    }}>
                    {this.state.deviceName}
                </Button>
            </div>
        )
    }


}


function Devices(props) {

    const hubClicked = JSON.parse(localStorage.getItem('hubClicked'));
     const [devicesArray, setDevicesArray] = useState([]);

    const getDevices = (clickedHubId) => {
        getDevicesByHub(clickedHubId)
            .then(resolvedPromise => {
                const devicesArrayTemp = resolvedPromise.data;
                setDevicesArray(devicesArrayTemp);
            })
    }

    useEffect(() => {
        getDevices(hubClicked.hubId);
    }, []);


    return (
        <div className='Devices'>
            <List component={Stack} direction="row" sx={{ float: 'left' }}>
                {devicesArray.map((device) => (
                    <ListItem key={device.deviceId} sx={{ paddingRight: 3 }}>
                        <DeviceButtons
                            deviceName={device.deviceName}
                            deviceId={device.deviceId}
                            handleDeviceSelected={(deviceId) => props.handleDeviceSelected(deviceId)}
                        ></DeviceButtons>
                    </ListItem>
                ))}
            </List>
        </div>
    )
}


class PageTitle extends React.Component {
    render() {
        return (
            <div className='PageTitle'>
                <h1>Available Devices</h1>
            </div>
        )
    }
}

class TextBox extends React.Component {


    render() {
        return (
            <div className='TextBox'>
                <PageTitle />
                <Divider />
                <Devices
                    hubClicked={this.props.hubClicked}
                    navigate={this.props.navigate}
                    dispatch={this.props.dispatch}
                    handleDeviceSelected={(deviceId) => this.props.handleDeviceSelected(deviceId)}
                /> 
            </div>
        );
    }
}



export default function DeviceOverview() {
    const hubClicked = useSelector((state) => state.hubClicked);
    const navigate = useNavigate();

    if (window.performance) {
        if (performance.navigation.type !== 1) {
            localStorage.setItem("hubClicked", JSON.stringify(hubClicked));
        }
    }

    function handleDeviceSelected(deviceId) {
        navigate("/features", { state: deviceId });
    }
    return (
        <div className="DeviceOverview">
            <header className="DeviceOverview-header">
                <TextBox
                    hubClicked={hubClicked}
                    handleDeviceSelected={handleDeviceSelected}
                />
            </header>
        </div>
    );
}