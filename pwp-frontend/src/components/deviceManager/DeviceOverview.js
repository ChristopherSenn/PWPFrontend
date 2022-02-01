import React from 'react';
import './DeviceOverview.css'
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import Stack from '@mui/material/Stack';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import {getDevicesByHub} from './DeviceOverviewInterface'
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




class DeviceButtons extends React.Component{
    constructor (props){
        super(props);
        this.state = {
            deviceName: "Your Device",
            deviceId: "The deviceId"
        };
    }

    componentDidMount() {
        this.setState({deviceName: this.props.deviceName});
        this.setState({deviceId: this.props.deviceId})
    }

   
   

    render(){

        
        console.log(this.state.deviceName);
        console.log(this.state.deviceId);
        return(
            <div className = "DeviceButtons">
                <Button sx={{color: 'white', backgroundColor: '#787878', width: 200, height: 70, "&:hover": {backgroundColor: '#999999'}}}   
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



    handleDeviceSelected(deviceId){
        console.log("ist in devices");    }

    componentDidMount(){


        const clickedHubId = this.props.hubClicked.hubId;

        console.log(getDevicesByHub(clickedHubId));

        getDevicesByHub(clickedHubId).then(devices => {
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
            <div className ='PageTitle'>
                <h1>Available Devices</h1>
            </div>
        )
    }
}

class TextBox extends React.Component {


    render () {
        return(
           <div className='TextBox'>
               <PageTitle/>
               <Divider />
               <Devices
                 hubClicked={this.props.hubClicked}
                 navigate={this.props.navigate}
                 dispatch={this.props.dispatch}
                 handleDeviceSelected = {(deviceId) => this.props.handleDeviceSelected(deviceId)}
               />
           </div>
        );
    }
}



export default function DeviceOverview() {
    const hubClicked = useSelector((state) => state.hubClicked);
   
   

    const navigate= useNavigate();


    function handleDeviceSelected(deviceId) {
        
        navigate("/features", {state: deviceId});

    }

        

    return(
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