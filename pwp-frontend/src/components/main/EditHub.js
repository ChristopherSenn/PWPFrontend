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
export default function EditHub() {

    const navigate = useNavigate();
    
    // @state contains the information about the hub that was clicked. It gets passed via navigate() in Dashboard.js
    const { state } = useLocation();
    // saving the members of the clicked hubs as an array
    const memberIdsProps = state.memberIds; 

    const userLogin = useSelector((state) => state.userLogin);
    const { user } = userLogin; // information of logged in user
 
    const [selectedMemberNames, setSelectedMemberNames] = useState([]); // names of memebers that are selected
    const [allMembersObject, setAllMembersObject] = useState([]); // list of all users
    const [membersOfHub, setMembersOfHub] = useState([]) // contains Member names and ids of hub 
    
    
    // getMembersOfEditedHub : id and username
    const getMembersOfEditedHub = async () => {
        const usersObject = []; // contains id and username of all users 

        loadUsers()
            .then(users => { // Loading all users from DB
                for (const item of users.data){
                    if(user.id !== item.id ){
                        usersObject.push({id: item.id, username: item.username});
                    }
                    setAllMembersObject(usersObject)
                } 
                return usersObject; // returns an array containing objects with information about every user
            })
            .then((users) => { // @users is the value from the previous then()
                const listOfMembersToShow = []; 
                // Iterating through all users
                users.forEach((member)=>{
                    // Iterating through the members of the clicked hub
                    memberIdsProps.forEach((item)=>{
                        if(member.id === item){
                            // Saving the members of the edited hub in an array. Each member is saved in an object containing username and id
                            listOfMembersToShow.push({ id: member.id, username: member.username })
                        }
                    })
                })
                // Setting state with the members that should be shown in the members list
                setMembersOfHub(listOfMembersToShow)
            })
     }
    
     useEffect(() => {
        getMembersOfEditedHub()
      }, []);

    // redirect to dashboard
    const cancelButtonHandler = () => {
        navigate('/dashboard');
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
      const deleteMemeber = async (e, memberId) =>{

        e.preventDefault();
      
        const config = {
            headers: {
              "Content-type": "application/json",
            },
          };
          const removedUser = {
            "userId": user.id,
            "memberIds": memberId,
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
        const tempHubMembers = [];
        membersOfHub.forEach(item =>{
            if(item.id !== memberId ){
                tempHubMembers.push(item)
                console.log(item)

            }
        })
        setMembersOfHub(tempHubMembers)
    
    }


    // add new members to hub
    const onSubmit = async (e) => {
        e.preventDefault();
      
        const idsOfSelectedMembers = [];
        const config = {
            headers: {
              "Content-type": "application/json",
            },
          };
    
        allMembersObject.forEach(member => {
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
        <Typography component="h1" variant="h5"  sx={{ mt: 1, alignItems: 'center'}}>
            Edit Hub
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
            {allMembersObject.map((member) => (
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
          >
            Add Members
          </Button>

            <Button
            onClick={cancelButtonHandler}
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
                <IconButton edge="end" aria-label="delete" onClick={(e) => deleteMemeber(e, member.id)}>
                      <DeleteIcon />
                    </IconButton>
              </ListItem>
            ))}
            </List>
            </Grid>
    </Container>
    )
}