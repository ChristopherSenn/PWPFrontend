import React from 'react';
import './DeviceOverview.css'
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import Stack from '@mui/material/Stack';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';

class AddDevice extends React.Component{
    render(){
        return (
            <div className='AddDevice'>
                <IconButton aria-label="delete" size="large" sx={{backgroundColor: '#787878', color: 'white', "&:hover": {backgroundColor: '#999999'}}} >
                  <AddIcon fontSize="inherit" />
                </IconButton> 
            </div>
        )
    }

}

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

    clickTest

    render(){
        console.log(this.state.deviceName);
        console.log(this.state.deviceId);
        return(
            <div className = "DeviceButtons">
                <Button sx={{color: 'white', backgroundColor: '#787878', width: 150, height: 70, "&:hover": {backgroundColor: '#999999'}}}>
                      {this.state.deviceName}
                </Button> 
            </div>
        )
    }


}


class Devices extends React.Component{

    render(){
        const deviceName1 = "Hallo"
        const deviceId1 = "123"

        const deviceName2 = "Hi"
        const deviceId2 = "987"
        return(
            <div className='Devices'>
               <List component={Stack} direction="row" sx={{float: 'left'}}>
                 <ListItem key= 'hello' sx={{paddingRight: 3}}>
                   <DeviceButtons
                     deviceName = {deviceName1}
                     deviceId = {deviceId1}
                    ></DeviceButtons>
                 </ListItem>
                 <ListItem key= 'hi' sx={{paddingRight: 3}}>
                 <DeviceButtons
                     deviceName = {deviceName2}
                     deviceId = {deviceId2}
                    ></DeviceButtons> 
                 </ListItem>
                 <ListItem key= 'hey' sx={{paddingRight: 3}}>
                   <Button sx={{color: 'white', backgroundColor: '#787878', width: 150, height: 70, "&:hover": {backgroundColor: '#999999'}}}>
                      hey
                   </Button>  
                 </ListItem>
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
               <Devices/>
               <AddDevice/>
           </div>
        );
    }
}

export default function DeviceOverview() {

    return(
        <div className="DeviceOverview">
          <header className="DeviceOverview-header">
            <TextBox/>
          </header>
        </div>
    );
}