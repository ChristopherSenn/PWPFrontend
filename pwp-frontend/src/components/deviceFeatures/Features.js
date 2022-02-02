import React from 'react';
import './Features.css'
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfo } from '@fortawesome/free-solid-svg-icons/faInfo';
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
import { deleteDevice } from '../mqttListener/DeviceInterface';
import { useNavigate } from "react-router-dom";

class Delete extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            alertIsOpen: false,
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


    };

    render() {
        return (
            <div className='Delete'>
                <IconButton aria-label="delete" size="large" sx={{ backgroundColor: '#787878', color: 'white', "&:hover": { backgroundColor: '#999999' } }} onClick={this.handleOpenAlert}>
                    <DeleteIcon fontSize="inherit" />
                </IconButton>
                <Dialog
                    open={this.state.alertIsOpen}
                    onClose={this.handleCloseAlert}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        {"Delete Device"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Do you really want to delete this device?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button sx={{ backgroundColor: '#787878', color: 'white', "&:hover": { backgroundColor: '#999999' } }} onClick={this.handleCloseAlert}>No</Button>
                        <Button sx={{ backgroundColor: '#787878', color: 'white', "&:hover": { backgroundColor: '#999999' } }} onClick={this.handleDelete} autoFocus>Yes</Button>
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
                <Button sx={{ color: 'white', backgroundColor: '#787878', width: 150, height: 70, "&:hover": { backgroundColor: '#999999' } }}
                    onClick={(e) => {
                        const actionName = this.state.actionName;
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
                    <DialogTitle id="alert-dialog-title">
                        {this.state.actionName}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            How long do you want to {this.state.actionName}?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <label >
                            <input type="text" name="topic" value={this.state.inputForAction} onChange={this.handleChangeInput} />
                        </label>
                        <br />
                        <Button sx={{ backgroundColor: '#787878', color: 'white', "&:hover": { backgroundColor: '#999999' } }} onClick={this.handleCloseAlert}>Submit</Button>
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


        return (
            <div className='Functionalities'>
                <h3>Functionalities:</h3>
                <List component={Stack} direction="row" sx={{ float: 'left' }}>
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
            <h5>Status: ON</h5>
        )
    }
}

class DeviceProperties extends React.Component {


    render() {
        return (
            <div className='DeviceProperties'>
                <h3>Current properties:</h3>
                <FakeProperties />
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
            <h5>Event: Open</h5>
        )
    }
}

class DeviceStatus extends React.Component {

    render() {
        return (
            <div className='DeviceStatus'>
                <h3>Current events:</h3>
                <FakeEvents />

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
                <h3>Currently used Security Mode:</h3>
                <Button startIcon={<FontAwesomeIcon icon={faInfo} />} sx={{ color: 'white', backgroundColor: '#787878', "&:hover": { backgroundColor: '#999999' } }} aria-describedby={securityExplanationPopup} variant="contained" onClick={this.securityExplanationClick}>{this.props.securityMode} </Button>
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
                    <SecurityExplanation />
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
            <Typography component="h1" variant="h5" sx={{ mt: 2, alignItems: 'center' }}>
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

    render() {

        return (
            <div className='TextBox'>
                <DeviceName
                    deviceName={this.props.deviceName}
                ></DeviceName>
                <Divider />
                <List component={Stack} direction="row" sx={{ marginTop: -3, marginLeft: -2 }} >
                    <ListItem key='SecurityMode' >
                        <SecurityMode
                            securityMode={this.props.securityMode}
                        >
                        </SecurityMode>
                    </ListItem>
                    <ListItem key='DeviceStatus' >
                        <DeviceStatus />
                    </ListItem>
                    <ListItem key="DeviceProperties">
                        <DeviceProperties></DeviceProperties>
                    </ListItem>
                </List>
                <Divider />

                <Functionalities
                    actions={this.props.actions}
                ></Functionalities>
                <Delete
                    deviceId={this.props.deviceId}
                ></Delete>
            </div>
        );
    }
}


export default TextBox;





