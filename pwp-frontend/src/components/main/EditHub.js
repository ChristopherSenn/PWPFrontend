import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useSelector } from "react-redux";
import { loadUsers } from '../../actions/userActions';
import axios from "axios";
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import { authHeader } from "../../utilis/setToken";
import { sortDropdown } from "../../utilis/sortDropdown";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import InfoIcon from '@mui/icons-material/Info';
import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined';

// Alert for further information about the hub
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


export default function EditHub() {
    // Instantiate React navigate to easily navigate between the different pages
    const navigate = useNavigate();

    // @state contains the information about the hub that was clicked. It gets passed via navigate() in Dashboard.js
    const { state } = useLocation();

    // Saving the members of the clicked hub as an array
    const memberIdsProps = state.memberIds; 
    // userLogin = information of user that is currenty loggedin
    const userLogin = useSelector((state) => state.userLogin);
    const { user } = userLogin; // information of logged in user
 
    // State for users are selected as members for the edited hub in the dropdown
    const [selectedMemberNames, setSelectedMemberNames] = useState([]); 
    // State for the users to select from in the dropdown
    const [dropDownMembersArray, setdropDownMembersArray] = useState([]); 
    // State for the users that are already members of the opened hub
    const [membersOfHub, setMembersOfHub] = useState([]) 
    // State for the dialog (further information about the hub)
    const [openDialog, setOpenDialog] = useState();
    // State for showing alert when member was successfully deleted 
    const [open, setOpen] = useState(false);

    // To close the alert when a member was successfully deleted
    const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
      setOpen(false);
    };
  
    
    // getMembersOfEditedHub : id and username
    const getMembersOfEditedHub = async () => {

        loadUsers()
            .then(users => { // Loading all users from DB
                const usersObjectArray = []; // contains id and username of all users 

                // Pushes information about all users except the logged in one into an array
                for (const item of users.data){
                    if(user.id !== item.id ){
                        usersObjectArray.push({id: item.id, username: item.username});
                    }
                } 
                return usersObjectArray; // returns an array containing objects with information about every user except the one logged in
            })
            .then((users) => { // @users is the value from the previous then()
                const listOfMembersToShow = []; 
                // Iterating through all users
                users.forEach((member)=>{
                    // Iterating through the members of the clicked hub
                    memberIdsProps.forEach((memberId)=>{
                        if(member.id === memberId){
                            // Saving the members of the edited hub in an array. Each member is saved in an object containing username and id
                            listOfMembersToShow.push({ id: member.id, username: member.username })
                        } 
                    })
                })
                // Setting state with the members that are shown as members. Ordered alphabetically
                setMembersOfHub(sortDropdown(listOfMembersToShow))
                return { allUsers: users, listForMemberSection: listOfMembersToShow };
            })
            .then((objectWithUserLists) => { // Updates the dropdown, that only members who haven't been added to the hub yet are shown
                
                const tempDropDownUser = objectWithUserLists.allUsers; 
                
                for(const member of objectWithUserLists.listForMemberSection) {
                  for(const user of objectWithUserLists.allUsers){
                    if(user.id === member.id) {
                      const idx = tempDropDownUser.indexOf(user)
                      tempDropDownUser.splice(idx, 1); 
                    }
                  }
                }        
                setdropDownMembersArray(sortDropdown(tempDropDownUser))
            })
     }
    

    useEffect(() => {
        getMembersOfEditedHub()
    }, []);

    // Redirect to dashboard
    const redirectToPage = () => {
        navigate('/dashboard');
    }

    // Excecuted when logged in user cancels hub editing process
    const cancelMembers = () => {
      setSelectedMemberNames([])
  }
    
    // Select a user from from the dropdown
    const selectChange = (event) => {
        const {
          target: { value },
        } = event;
        setSelectedMemberNames(
          typeof value === 'string' ? value.split(',') : value,
        );
      };

    // Removes member from hub in frontend and in DB
    const removeMember = async (e, member) =>{
      e.preventDefault();

      const config = {
        headers: authHeader()
      };
    
      const removedUser = {
        "userId": user.id,
        "memberIds": member.id,
        "hubId" : state.hubId
      }
      try {
        await axios.patch(
          'http://localhost:4500/hubs/removeUser',
          removedUser, config
        )
      } catch (error) {
          console.log(error.message);
      }
      

      /* For some reason setState isn't executed in time, 
      therefore we need a promise to update the displayed members and the dropdown with remaining users to choose from.
      Both happens in the code below. */
      new Promise((resolve) => {
          const tempHubMembers = [];
          membersOfHub.forEach(item =>{
              if(item.id !==  member.id ){
                  tempHubMembers.push(item)
              }
          })
          const tempDropDownMembersArray = dropDownMembersArray;
          tempDropDownMembersArray.push({ id: member.id, username: member.username});
          resolve({tempHubMembers: tempHubMembers, tempDropdown: sortDropdown(tempDropDownMembersArray)});
      })
      .then((tempObjectWithArrays) => {
          setMembersOfHub(sortDropdown(tempObjectWithArrays.tempHubMembers));
          setdropDownMembersArray(sortDropdown(tempObjectWithArrays.tempDropdown));
      })
      setOpen(true);
    }

    // Add new members to hub
    const onSubmit = async (e) => {
        e.preventDefault();
        const idsOfSelectedMembers = [];
        const config = {
          headers: authHeader()
        };
    
        dropDownMembersArray.forEach(member => {
            selectedMemberNames.forEach(selectedMember => {
                if(member.username === selectedMember) {
                    idsOfSelectedMembers.push(member.id)
                }
            })
        })
    
        const createdAddMemberInfo = {
          "userId": user.id,
          "memberIds": idsOfSelectedMembers,
          "hubId" : state.hubId
        }
    
        // Edit hub in the DB so it contains the newly selected users
        try {
            await axios.patch(
            'http://localhost:4500/hubs/addUser',
            createdAddMemberInfo, config
            )
            navigate('/dashboard');
        } catch (error) {
            console.log(error.message);
        }
      }; 

    const openDialogHandler =() => {
      setOpenDialog(true)
    }
    const closeDialogHandler = () => {
      setOpenDialog(false);
    };
    

    return (
    <Container component="main" maxWidth="xs">
         <Box component="form" onSubmit={(e) => onSubmit(e)} sx={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
      }}>
        <Typography component="h1" variant="h5"  sx={{ mt: 1}}>
        <Button
            onClick={redirectToPage}
            variant="text"
            sx={{ mt:1 ,  width:"20px", "&:hover": {backgroundColor: '#cbc3be'}}}
            startIcon={<ArrowBackIosOutlinedIcon sx={{ color: '#ab9c8a', width: "100%", height:"1%" }}/>}
            >
            </Button>
          Edit Hub 
          <IconButton variant="outlined" onClick={openDialogHandler}>
            <InfoIcon />
          </IconButton>
        </Typography>
          <Snackbar open={openDialog} onClose={closeDialogHandler} style={{
            position: "absolute", left: "40%",
            top: "50%", bottom: "50%"
          }}>
            <Alert onClose={closeDialogHandler} severity="info" sx={{ width: '100%',  bgcolor: '#69849b' }}>
              <List sx={{ pt: 0 }}>
                <Typography>Hub Information:</Typography>
                <ListItem >
                  <ListItemText primary={`ID: ${state.hubId}`} key={1} />
                </ListItem>
                <ListItem  >
                  <ListItemText primary={`Password: ${state.password}`} key={2} />
                </ListItem>
              </List>
            </Alert>
          </Snackbar>
        <Box
          sx={{
            marginTop: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        ></Box>
        <InputLabel id="hubUsersSelectLabel">Choose Member:</InputLabel>
          <Select
            labelId="hubUsersSelectLabel"
            label= "Choose Members"
            id="hubUsersSelect"
            multiple
            value={selectedMemberNames}
            fullWidth
            onChange={selectChange}
            renderValue={(selected) => selected.join(', ')}
            input={<OutlinedInput label="All Users" />}
          >
            {dropDownMembersArray.map((member) => (
              <MenuItem key={member.username} value={member.username}>
                <Checkbox checked={selectedMemberNames.indexOf(member.username) > -1} />
                <ListItemText primary={member.username} />
              </MenuItem>
            ))}
          </Select>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 1, bgcolor: "#3d6a66", color:"white" ,  "&:hover": { backgroundColor: '#7c9a92' }}}
            disabled={selectedMemberNames.length === 0}
          >
            Add Members
          </Button>

            <Button
            onClick={cancelMembers}
            fullWidth
            variant="text"
            sx={{ mt: 1 ,color:"#3d6a66", bgcolor:"#c7d3bf",  "&:hover": { backgroundColor: '#c1c9cd' }}}
          >
            Cancel
          </Button>
        </Box>
        <Grid item xs={12} md={6}>
          <Typography sx={{ mt: 4, mb: 2, alignItems: 'center' }} variant="h6" component="div" >
            Members of Hub:
          </Typography>
          <List>
            {membersOfHub.map((member) => (
              <ListItem key={member.username} value={member.username}>
                <ListItemText primary={member.username} />
                <IconButton aria-label="delete" onClick={(e) => removeMember(e, member)}>
                  <DeleteIcon />
                </IconButton>
                <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
                  <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                      Member was successfully deleted
                  </Alert>
                </Snackbar>
              </ListItem>
            ))}
            </List>
            </Grid>
    </Container>
    )
}