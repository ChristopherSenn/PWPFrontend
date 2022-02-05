import React from 'react';
import './DeviceOverview.css'
import Stack from '@mui/material/Stack';
import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { getDevicesByHub } from './DeviceOverviewInterface'
import { useNavigate } from "react-router-dom";
import { Navigate } from 'react-router-dom';


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



class Devices extends React.Component{
    constructor (props){
        super(props);
        this.state = {
            namesOfDevices: [],
        };
    }

    componentDidMount(){

        const hubClicked = JSON.parse(localStorage.getItem('hubClicked'));

        //get all devices that are contained in the selected hub
        getDevicesByHub(hubClicked).then(devices => {
            for (const device of devices.data){
                const namesOfDevices = this.state.namesOfDevices;
                const addNewDevice = namesOfDevices.concat([device])
                this.setState({namesOfDevices: addNewDevice});
                
            }
        }) 
    }
 
    render(){

        var namesOfDevices = this.state.namesOfDevices;
        var deviceList = "";

        //create a personalized button for each of the devices
        if (namesOfDevices !== null){
            deviceList = namesOfDevices.map((device) =>
            deviceList = 
            <ListItem key= {device.deviceId} sx={{paddingRight: 3}}>
                <DeviceButtons
                  deviceName = {device.deviceName}
                  deviceId = {device.deviceId}
                  handleDeviceSelected = {(deviceId) => this.props.handleDeviceSelected(deviceId)}
                ></DeviceButtons>  
            </ListItem>
            );
        }
        

        return(
            <div className='Devices'>
               <List component={Stack} direction="row" sx={{float: 'left'}}>
                 {deviceList}
               </List>
            </div>
        )
    }

}

class PageTitle extends React.Component{
   
    render () {
        return (
            <div className='PageTitle'>
            <Typography component="h1" variant="h5" sx={{ mt: 2, alignItems: 'center', color:"#314448"}}>
                <RedirectButton/>
            Available Devices
            </Typography>
            </div>
        )
    }
}

class RedirectButton extends React.Component {
    constructor (props){
        super(props);
        this.state = {
            redirect: false,
        };
    }

    render () {
        //navigate to hub overview if return button was clicked
        const { redirect } = this.state;
        if(redirect) {
            return <Navigate to='/dashboard'/>;
        }
        return (
                <Button
                    onClick={(e) => {
                        this.setState({redirect: true})
                    }}
                    variant='text'
                    sx={{ mt: 1, width: "30px", "&:hover": { backgroundColor: '#cbc3be' } }}
                    startIcon={<ArrowBackIosOutlinedIcon sx={{ color: '#ab9c8a', width: "100%", height: "1%" }} />}
                >
                </Button>
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
                    handleDeviceSelected={(deviceId) => this.props.handleDeviceSelected(deviceId)}
                />
            </div>
        );
    }
}



export default function DeviceOverview() {
    const navigate = useNavigate();

    //save the deviceId in state when navigation to the device overview
    function handleDeviceSelected(deviceId) {
        navigate("/features", { state: deviceId });
    }
    return (
        <div className="DeviceOverview">
            <header className="DeviceOverview-header">
                <TextBox
                    handleDeviceSelected={handleDeviceSelected}
                />
            </header>
        </div>
    );
}