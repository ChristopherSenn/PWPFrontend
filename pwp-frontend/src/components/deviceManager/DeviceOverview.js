import React from 'react';
import './DeviceOverview.css'
import Stack from '@mui/material/Stack';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { getDevicesByHub } from './DeviceOverviewInterface'
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Typography from '@mui/material/Typography';
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
                <Button sx={{ color: 'black', backgroundColor: '#d0c3bd', width: 200, height: 70, "&:hover": { backgroundColor: '#dcdcdd' } }}
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



class Devices extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            namesOfDevices: [],
        };
    }



    handleDeviceSelected(deviceId) {
        console.log("ist in devices");
    }

    componentDidMount() {


        const clickedHubId = this.props.hubClicked.hubId;

        getDevicesByHub(clickedHubId).then(devices => {
            for (const device of devices.data) {
                const namesOfDevices = this.state.namesOfDevices;
                const addNewDevice = namesOfDevices.concat([device])
                this.setState({ namesOfDevices: addNewDevice });

            }
        })



    }


    render() {

        var namesOfDevices = this.state.namesOfDevices;
        var deviceList = "";


        if (namesOfDevices !== null) {
            deviceList = namesOfDevices.map((device) =>
                deviceList =
                <ListItem key={device.deviceId} sx={{ paddingRight: 3 }}>
                    <DeviceButtons
                        deviceName={device.deviceName}
                        deviceId={device.deviceId}
                        handleDeviceSelected={(deviceId) => this.props.handleDeviceSelected(deviceId)}
                    ></DeviceButtons>
                </ListItem>
            );
        }


        return (
            <div className='Devices'>
                <List component={Stack} direction="row" sx={{ float: 'left' }}>
                    {deviceList}
                </List>
            </div>
        )
    }

}

class PageTitle extends React.Component {
    render() {
        return (
            <Typography variant="h5"  component="div">
                Available Devices:
           </Typography>
        )
    }
}

class TextBox extends React.Component {


    render() {
        return (
           <Box>
               
                <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >  <PageTitle />
                <Devices
                    hubClicked={this.props.hubClicked}
                    navigate={this.props.navigate}
                    dispatch={this.props.dispatch}
                    handleDeviceSelected={(deviceId) => this.props.handleDeviceSelected(deviceId)}
                />
            </Box>
            </Box>
        );
    }
}



export default function DeviceOverview() {
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