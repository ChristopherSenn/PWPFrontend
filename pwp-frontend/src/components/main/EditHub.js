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

    const { state } = useLocation();
    // contains the information about the clicked hub

    const userLogin = useSelector((state) => state.userLogin);
    const { user } = userLogin; // information of logged in user
 

    const [selectedMemberNames, setSelectedMemberNames] = useState([]); // names of memebers that are selected
    const [allMembersObject, setAllMembersObject] = useState([]); // list of all users
   
    const listOfUsersObject = []; // contains id and username all users 
    const [memebersOfHub, setMembersOfHub] = useState([]) // contains Member names and ids of hub 
    
    const listOfMembersObject = []; 

    const navigate = useNavigate();
    
    // get all users : id and username
    const getAllUsers = async () => {
        loadUsers().then(users =>{
          for (const item of users.data){
              if(user.id !== item.id ){
                listOfUsersObject.push({id: item.id, username: item.username});
              }
          } 
          setAllMembersObject(listOfUsersObject)
     
        })
     }
     // get memeber of hub: username and id
     const getListOfMembersHub = ()=>{
        state.memberIds.forEach((memberId)=>{
            if(memberId !== state.ownerId){
                allMembersObject.forEach((item)=>{
                    if(memberId === item.id){
                        listOfMembersObject.push({id:item.id, username: item.username})
                    }
                })
            }
        })
         setMembersOfHub(listOfMembersObject)
     }
    useEffect(() => {
        getAllUsers()
        getListOfMembersHub()
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
            {memebersOfHub.map((member) => (
              <ListItem key={member.username} value={member.username}>
                <ListItemText primary={member.username} />
                <IconButton edge="end" aria-label="delete">
                      <DeleteIcon />
                    </IconButton>
              </ListItem>
            ))}
            </List>
            </Grid>
    </Container>
    )
}