import React from 'react';
import './Features.css'
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfo } from '@fortawesome/free-solid-svg-icons/faInfo';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Popover from '@mui/material/Popover';
import SecurityExplanation from '../main/securityExplanation';




class Delete extends React.Component {

    constructor (props){
        super(props);
        this.state = {
            alertIsOpen: false,
        };
    }

    handleOpenAlert = () => {
        this.setState({alertIsOpen: true});
    };

    handleCloseAlert = () => {
        this.setState({alertIsOpen: false});
    };


    hanldeDelete = () => {
        console.log("Delete was pressed");
       
    };

    render () {
        return(
            <div className='Delete'>
                <IconButton aria-label="delete" size="large" sx={{backgroundColor: '#787878', color: 'white', "&:hover": {backgroundColor: '#999999'}}} onClick = {this.handleOpenAlert}>
                  <DeleteIcon fontSize="inherit"/>
                </IconButton>
                <Dialog
                  open = {this.state.alertIsOpen}
                  onClose = {this.handleCloseAlert}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        {"Delete Device"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id ="alert-dialog-description">
                            Do you really want to delete this device?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button sx={{backgroundColor: '#787878', color: 'white', "&:hover": {backgroundColor: '#999999'}}} onClick={this.handleCloseAlert}>No</Button>
                        <Button sx={{backgroundColor: '#787878', color: 'white', "&:hover": {backgroundColor: '#999999'}}} onClick={this.handleCloseAlert} autoFocus>Yes</Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}


class Functionalities extends React.Component {
    constructor (props){
        super(props);
        this.state = {
            actions: [],
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({actions: nextProps});
    }


    render () {
        
        var actions = this.props.actions;
        var actionList = "";

        if (actions !== null){
            actionList = actions.map((action) =>
            actionList = 
            <ListItem key= {action} sx={{paddingRight: 3}}>
                <Button sx={{color: 'white', backgroundColor: '#787878', width: 150, height: 70, "&:hover": {backgroundColor: '#999999'}}}>
                  {action}
                </Button>  
            </ListItem>
            );
        }


        return(
            <div className='Functionalities'>
                <h3>Functionalities:</h3>
                <List component={Stack} direction="row" sx={{float: 'left'}}>
                  {actionList}
                </List>
            </div>

        )

    }
}

class DeviceStatus extends React.Component{

    render() {
        return(
            <div className='SecurityMode'>
                <h3>Current device status:</h3>
                  
            </div>
        )
    }
}

class SecurityMode extends React.Component{
    constructor (props){
        super(props);
        this.state = {
            anchorEl: null,
        };
    }

    securityExplanationClick = (event) => {
        this.setState({anchorEl: event.currentTarget});
    };

    handleClose = () => {
        this.setState({anchorEl: null});
    };

    render() {
        const securityExplanationPopupOpen = Boolean(this.state.anchorEl);
        const securityExplanationPopup = securityExplanationPopupOpen ? 'simple-popover' : undefined;
        return(
            <div className='SecurityMode'>
                <h3>Currently used Security Mode:</h3>
                <Button startIcon={<FontAwesomeIcon icon={faInfo} />} sx={{color: 'white', backgroundColor: '#787878', "&:hover": {backgroundColor: '#999999'}}} aria-describedby={securityExplanationPopup} variant="contained" onClick={this.securityExplanationClick}>Local Network </Button> 
                <Popover
                      id={securityExplanationPopup}
                      open={securityExplanationPopupOpen}
                      anchorEl={this.state.anchorEl}
                      onClose={this.handleClose}
                      anchorOrigin={{
                        vertical: 'center',
                        horizontal: 'left',
                      }}
                    >
                      <SecurityExplanation/>
                    </Popover> 
            </div>
        )
    }
}


class DeviceName extends React.Component {
    constructor (props){
        super(props);
        this.state = {
            deviceName: 'Your Device',
        };
    }

    componentDidMount(){
        console.log("ist aufgerufen")
        this.setState({deviceName: "Mixer"});
    }


    
    render (){
        return(
            <div className='DeviceName'>
                <h1>{this.state.deviceName}</h1>
            </div>
        )
    }
}

class TextBox extends React.Component {

    render () {
        return(
           <div className='TextBox'>
               <DeviceName>
               </DeviceName>
               <Divider />
               <List component={Stack} direction="row" sx={{marginTop: -3, marginLeft: -2}} >
               <ListItem key= 'SecurityMode' >
               <SecurityMode/>
               </ListItem>
               <ListItem key= 'DeviceStatus' >
               <DeviceStatus/>
               </ListItem>
               </List>
               <Divider />
               <Functionalities
                 actions={this.props.actions}
               ></Functionalities>
               <Delete>

               </Delete>
           </div>
        );
    }
}


export default TextBox;





