import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import Container from '@mui/material/Container';
import axios from "axios";
import { useSelector } from "react-redux";
import Typography from '@mui/material/Typography';
import { loadUsers } from '../../actions/userActions';
import { authHeader } from '../../utilis/setToken';
import { sortDropdown } from "../../utilis/sortDropdown";
import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined';
export default function AddHub() {

  // userLogin = information of user that is currenty loggedin
  const userLogin = useSelector((state) => state.userLogin);
  const { user } = userLogin;

  // Introduce state for the hubname (name of the hub created), the members that are selected for the hub and for all members (all user that exist in DB)
  const [hubName, setHubName] = useState('');
  const [selectedMemberNames, setSelectedMemberNames] = useState([]);
  const [allMembersObject, setAllMembersObject] = useState([]);
  // Instantiate React navigate to easily navigate between the different pages
  const navigate = useNavigate();

  const listOfUsersObject = [];

  // When component mounted get all users from DB
  useEffect(() => {
    getAllUsers()
  }, []);

  // Get all users from DB, sort them alphabetically and put them into state
  const getAllUsers = async () => {
    loadUsers().then(users =>{
      for (const item of users.data){
        if(user.id !== item.id ){
        listOfUsersObject.push({id: item.id, username: item.username});
      } }
      setAllMembersObject(sortDropdown(listOfUsersObject))
    })
  }


  // Function executed when "Add members" is clicked
  const onSubmit = async (e) => {
    e.preventDefault();
  
    const idsOfSelectedMembers = [];

    // Get the IDs of the members which are selected in the dropdown
    allMembersObject.forEach(member => {
        selectedMemberNames.forEach(selectedMember => {
            if(member.username === selectedMember) {
                idsOfSelectedMembers.push(member.id)
            }
        })
    })

    const createdHubInfos = {
      "hubName": hubName,
      "ownerId": user.id,
      "memberIds": idsOfSelectedMembers
    }

    // Post all needed information about the hub to save the hub created/updated to the DB
    try {
      const config = {
        headers: authHeader()
      };
        await axios.post(
        'http://localhost:4500/hubs/createHub',
        createdHubInfos, config
        )
        navigate('/dashboard');
    } catch (error) {
        console.log(error.response);
        console.log(error.message);
        console.log(error.request);
    } 
  };

  // Display selected user in the text field of the dropdown
  const selectChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedMemberNames(
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const onChange = (e) => {
    setHubName(e.target.value)
  }

  // Function when cancelling "Add member" 
  const cancelButtonHandler = () => {
      setHubName('');
    if(selectedMemberNames.length > 0){
      setSelectedMemberNames([])
    }
  }
    // redirect to dashboard
    const redirectToPage = () => {
      navigate('/dashboard');
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box component="form" onSubmit={(e) => onSubmit(e)} sx={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
      }}>
              <Typography component="h1" variant="h5"  sx={{ mt: 2, alignItems: 'center'}}>
          <Button
            onClick={redirectToPage}
            variant='text'
            sx={{ mt:1 ,  width:"30px", "&:hover": {backgroundColor: '#cbc3be'}}}
            startIcon={<ArrowBackIosOutlinedIcon sx={{ color: '#ab9c8a', width: "100%", height:"1%" }}/>}
            >
            </Button>
            Create new Hub
        </Typography>
          <TextField
            required
            type="text"
            id="hubname"
            label="Hub name"
            fullWidth
            name="hubName"
            value={hubName}
            onChange={(e) => onChange(e)}
          />

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
            sx={{ mt: 1, bgcolor: "#3d6a66", color:"white" ,  "&:hover": { backgroundColor: '#7c9a92' }}}
            disabled={hubName.length === 0}
          >
            Create hub
          </Button>

          <Button
            onClick={cancelButtonHandler}
            fullWidth
            variant="text"
            sx={{ mt: 1 ,color:"#3d6a66", bgcolor:"#c7d3bf",  "&:hover": { backgroundColor: '#c1c9cd' }}}
          >
            Cancel
          </Button>
      </Box>
    </Container>
  )
}