import React, { useState, useEffect } from 'react';
import './DeviceOverview.css'
import Stack from '@mui/material/Stack';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authHeader } from '../../utilis/setToken';
import axios from 'axios'

export const getAllDevices = async () => {
    try {
        const requestHeader = {
            headers: authHeader()
        };
        return await axios.get('http://localhost:4500/devices/getDevices',
        requestHeader
        )
    } catch(error){
        console.log(error.message)
      }
}

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
    const [devicesArray, setDevicesArray] = useState([]);

    const getDevices = () => {
        getAllDevices()
            .then(resolvedPromise => {
                const devicesArrayTemp = resolvedPromise.data;
                setDevicesArray(devicesArrayTemp);
            })
    }

    useEffect(() => {
        getDevices();
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

class TextBox extends React.Component {
    render() {
        return (
            <div className='TextBox'>
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



export default function DevicesAll() {
    const hubClicked = useSelector((state) => state.hubClicked);
    const navigate = useNavigate();

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
