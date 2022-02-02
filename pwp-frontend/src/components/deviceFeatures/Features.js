import React from 'react';
import './Features.css'
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined';
import Typography from '@mui/material/Typography';
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
import InfoIcon from '@mui/icons-material/Info';
import { deleteDevice } from '../mqttListener/DeviceInterface';
import { useNavigate } from "react-router-dom";
import { Navigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';

class Delete extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            alertIsOpen: false,
            redirect: false
        };
    }


    handleOpenAlert = () => {
        this.setState({ alertIsOpen: true });
    };

    handleCloseAlert = () => {
        this.setState({ alertIsOpen: false });
    };


    handleDelete = () => {
        this.handleCloseAlert();
        const deviceId = this.props.deviceId;
        deleteDevice(deviceId);
        this.setState({ redirect: true});
    };

    render() {
        const { redirect } = this.state;
        if(redirect) {
            return <Navigate to='/deviceOverview'/>;
        }
        return (
            <div className='Delete'>
                <IconButton aria-label="delete" size="large"  onClick={this.handleOpenAlert}>
                    <DeleteIcon/>
                </IconButton>
                <Dialog
                    open={this.state.alertIsOpen}
                    onClose={this.handleCloseAlert}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title" style={{color:"#3b4834", fontFamily: 'Arial'}}>
                        {"Delete Device"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description" sx={{color:"#3b4834", fontFamily: 'Arial'}}>
                            Do you really want to delete this device?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button sx={{marginRight:'12px', backgroundColor: '#c6c3b3', color: 'black', "&:hover": { backgroundColor: '#cbc3be' } }} onClick={this.handleCloseAlert}>No</Button>
                        <Button sx={{ backgroundColor: '#3b4834', color: 'white', "&:hover": { backgroundColor: '#cbc3be' } }} onClick={this.handleDelete} autoFocus>Yes</Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}


class ActionButtons extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            actionName: "",
            inputType: "",
            alertIsOpen: false,
            inputForAction: "",
        };
    }

    componentDidMount() {
        this.setState({ actionName: this.props.actionName });
        this.setState({ inputType: this.props.inputType })
    }


    handleOpenAlert = () => {
        this.setState({ alertIsOpen: true });
    };

    handleCloseAlert = () => {
        this.setState({ alertIsOpen: false });
    };


    handleChangeInput = (event) => {
        this.setState({ inputForAction: event.target.value });
    }





    render() {

        return (
            <div className="ActionButtons">
                <Button sx={{ color: 'white', backgroundColor: '#314448', width: 140, height: 40, "&:hover": {backgroundColor: '#cbc3be'} }}
                    onClick={(e) => {
                        const inputType = this.state.inputType;

                        if (inputType === "float") {
                            this.handleOpenAlert()
                        }
                    }}
                >
                    {this.state.actionName}
                </Button>
                <Dialog
                    open={this.state.alertIsOpen}
                    onClose={this.handleCloseAlert}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title" style={{color:"#3b4834", fontFamily: 'Arial'}}>
                        {this.state.actionName}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description" style={{color:"#3b4834", fontFamily: 'Arial'}}>
                            How long do you want to {this.state.actionName}?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                            <div> 
                            <TextField type="text" name="topic" value={this.state.inputForAction} onChange={this.handleChangeInput} style={{marginRight:'50px'}} />
                         <div>
                             <br/>
                             <Button sx={{ backgroundColor: '#c6c3b3', color: 'black', "&:hover": { backgroundColor: '#cbc3be' } }} onClick={this.handleCloseAlert}>Cancel</Button>
                            <Button sx={{marginLeft:"12px",  backgroundColor: '#3b4834', color: 'white', "&:hover": { backgroundColor: '#cbc3be' } }} onClick={this.handleCloseAlert}>Submit</Button>
                            </div>
                            </div>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }


}


class Functionalities extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            actions: [],
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ actions: nextProps });
    }


    render() {



        var actions = this.props.actions;
        var actionList = "";


        if (actions !== null) {
            actionList = actions.map((action) =>
                actionList =
                <ListItem key={action.actionName} sx={{ paddingRight: 3, marginTop: -3 }}>
                    <ActionButtons
                        actionName={action.actionName}
                        inputType={action.inputType}
                    ></ActionButtons>
                </ListItem>
            );
        }


        return(
            <div>
                <h4 style={{color:"#7c9a92", textAlign:"left"}}>Functionalities:</h4>
                <List component={Stack} direction="row" sx={{float: 'left'}}>
                  {actionList}
                </List>
            </div>

        )

    }
}

class FakeProperties extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
        };
    }

    componentDidMount() {
        setTimeout(() => this.setState({ show: true }), 5000)
    }

    render() {
        return (
            this.state.show &&
            <h5 style={{color:"#314448"}}>Status: ON</h5>
        )
    }
}

class DeviceProperties extends React.Component {


    render() {
        return (
            <div className='DeviceProperties'>
                <h4 style={{color:"#7c9a92"}}>Current properties:</h4>
                <FakeProperties/>
            </div>
        )
    }
}

class FakeEvents extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
        };
    }

    componentDidMount() {
        setTimeout(() => this.setState({ show: true }), 7000)
    }

    render() {
        return (
            this.state.show &&
            <h5 style={{color:"#314448"}}>Event: Open</h5>
        )
    }
}

class DeviceStatus extends React.Component {

    render() {
        return(
            <div className='DeviceProperties'>
            <h4 style={{color:"#7c9a92"}}>Current events:</h4>
            <FakeEvents/>
        </div>
        
        )
    }
}

class SecurityMode extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            anchorEl: null,
        };
    }

    securityExplanationClick = (event) => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    render() {
        const securityExplanationPopupOpen = Boolean(this.state.anchorEl);
        const securityExplanationPopup = securityExplanationPopupOpen ? 'simple-popover' : undefined;
        return (
            <div className='SecurityMode'>
                <h4 style={{color:"#7c9a92"}} > Currently used Security Mode:</h4>
                <Button startIcon={<InfoIcon variant="outlined" />} sx={{backgroundColor:"#e0e8e5",color:"#314448", "&:hover": {backgroundColor: '#cbc3be'}}} variant="contained"  onClick={this.securityExplanationClick}>{this.props.securityMode} </Button> 
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


function DeviceName(props) {

    const navigate = useNavigate();
    const redirectToPage = () => {
        navigate('/deviceOverview');
    }
  
    return (
        <div className='DeviceName'>
            <Typography component="h1" variant="h5" sx={{ mt: 2, alignItems: 'center', color:"#314448" }}>
                <Button
                    onClick={redirectToPage}
                    variant='text'
                    sx={{ mt: 1, width: "30px", "&:hover": { backgroundColor: '#cbc3be' } }}
                    startIcon={<ArrowBackIosOutlinedIcon sx={{ color: '#ab9c8a', width: "100%", height: "1%" }} />}
                >
                </Button>
                {props.deviceName}
            </Typography>
        </div>
    )

}

class TextBox extends React.Component {

    render () {
        
        return(
           <div className='TextBox'>
               <DeviceName
                 deviceName = {this.props.deviceName}
               ></DeviceName>
               <Divider />
               <List component={Stack} direction="row" sx={{marginTop: -3, marginLeft: -2,  display: 'absolute'}} >
               <ListItem key= 'SecurityMode' >
               <SecurityMode
                   securityMode = {this.props.securityMode}
               >
               </SecurityMode>
               </ListItem>
               <ListItem key= 'DeviceStatus' >
               <DeviceStatus/>
               </ListItem>
               <ListItem key ="DeviceProperties">
                   <DeviceProperties></DeviceProperties>
               </ListItem>
               </List>
               <Divider />
               
               <Functionalities
                 actions={this.props.actions}
               ></Functionalities>
               <br/>
               <br/>
               <br/>
               <Delete 
                 deviceId = {this.props.deviceId}
               ></Delete>
               
           </div>
        );
    }
}


export default TextBox;





