import React, { useState, useEffect } from 'react';
import './DeviceOverview.css'
import Stack from '@mui/material/Stack';
import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { getDevicesByHub } from './DeviceOverviewInterface'
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';
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
                <Button sx={{ color: 'black', backgroundColor:"#7c9a92", width: 200, height: 70, "&:hover": { backgroundColor: '#dcdcdd' } }}
                    onClick={(e) => {
                        this.props.handleDeviceSelected(this.state.deviceId);
                    }}
                >
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
            <List component={Stack} direction="row" sx={{ float: 'left'}}>
                {devicesArray.map((device) => (
                    <ListItem key={device.deviceId} sx={{ paddingRight: 3}}>
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
     

function PageTitle() {

    const navigate = useNavigate();
    const redirectToPage = () => {
        navigate('/dashboard');
    }
    
    return (
        <Typography component="h1" variant="h5" sx={{ mt: 2, alignItems: 'center', color:"#314448"}}>
            <Button
                onClick={redirectToPage}
                variant='text'
                sx={{ mt: 1, width: "30px", "&:hover": { backgroundColor: '#cbc3be' } }}
                startIcon={<ArrowBackIosOutlinedIcon sx={{ color: '#ab9c8a', width: "100%", height: "1%" }} />}
            >
            </Button>
        Available Devices
        </Typography>
    )

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