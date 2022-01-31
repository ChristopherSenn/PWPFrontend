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
import DashboardCustomizeSharpIcon from '@mui/icons-material/DashboardCustomizeSharp';
import { authHeader } from "../../utilis/setToken";
import { sortDropdown } from "../../utilis/sortDropdown";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function EditHub() {
    const navigate = useNavigate();
    
    // @state contains the information about the hub that was clicked. It gets passed via navigate() in Dashboard.js
    const { state } = useLocation();
    // saving the members of the clicked hubs as an array
    const memberIdsProps = state.memberIds; 

    const userLogin = useSelector((state) => state.userLogin);
    const { user } = userLogin; // information of logged in user
 
    const [selectedMemberNames, setSelectedMemberNames] = useState([]); // names of memebers that are selected
    const [dropDownMembersArray, setdropDownMembersArray] = useState([]); // list of all users
    const [membersOfHub, setMembersOfHub] = useState([]) // contains Member names and ids of hub 
    
    const [open, setOpen] = useState(false); // open dialog for delete
    const [disable, setDisable] = useState(false); // disable buttons

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };
  
    
    // getMembersOfEditedHub : id and username
    const getMembersOfEditedHub = async () => {

        loadUsers()
            .then(users => { // Loading all users from DB
                const usersObjectArray = []; // contains id and username of all users 

                for (const item of users.data){
                    if(user.id !== item.id ){
                        usersObjectArray.push({id: item.id, username: item.username});
                    }
                } 
                return usersObjectArray; // returns an array containing objects with information about every user
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
                // Setting state with the members that are shown in the members list
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

    // redirect to dashboard
    const redirectToPage = () => {
        navigate('/dashboard');
    }
    const cancelMembers = () => {
      setSelectedMemberNames([])
  }
    
    // select a member from membersList
    const selectChange = (event) => {
        const {
          target: { value },
        } = event;
        setSelectedMemberNames(
          typeof value === 'string' ? value.split(',') : value,
        );
      };

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
      therefore we need a promise to update the member's list and the dropdown.
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
      setOpen(false)
    }

    // add new members to hub
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


    return (
    <Container component="main" maxWidth="xs">
         <Box component="form" onSubmit={(e) => onSubmit(e)} sx={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
      }}>
        <Typography component="h1" variant="h5"  sx={{ mt: 1}}>
            Edit Hub Member
        </Typography>
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
            sx={{ mt: 1 }}
            disabled={selectedMemberNames.length === 0}
          >
            Add Members
          </Button>

            <Button
            onClick={cancelMembers}
            fullWidth
            variant="outlined"
            sx={{ mt: 1 }}
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
                <IconButton aria-label="delete" onClick={handleClickOpen}>
                      <DeleteIcon/>
                    </IconButton>

                    <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Delete Member"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          Do you really want to delete this member?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button sx={{backgroundColor: '#787878', color: 'white', "&:hover": {backgroundColor: '#999999'}}} onClick={handleClose}>No</Button>
          <Button sx={{backgroundColor: '#787878', color: 'white', "&:hover": {backgroundColor: '#999999'}}} onClick={(e)=>removeMember(e, member)} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
              </ListItem>
            ))}
            </List>
            </Grid>
            <Button
            onClick={redirectToPage}
            fullWidth
            variant="outlined"
            startIcon={<DashboardCustomizeSharpIcon/>}
            sx={{ mt: 1 , backgroundColor: '#787878', color: 'white', "&:hover": {backgroundColor: '#999999'}}}
            >
            Back to Dashboard
            </Button>
    </Container>
    )
}