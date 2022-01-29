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


export default function AddHub() {

  // Man müsste eig nur noch die user-Liste ziehen und anstatt der Dummy-Liste an die Select-Box weiterreichen und dann eben mit dem Form die createHub füttern

  
  const [hubName, setHubName] = useState('');
  const [personName, setPersonName] = useState([]);
  const navigate = useNavigate();

  const loggedInUserInfo = localStorage.getItem("userInfo");
  const loggedInUserID = JSON.parse(loggedInUserInfo).id;


  const users = [
    // TODO: get user list with ids
    'User #1',
    'User #2',
    'User #3',
  ];

  useEffect( async () => {      
    /* try{
      const us = await axios.get('http://localhost:4500/users');
      console.log(us)
    } catch (error) {
      console.log(error.request)
    } */ 
  });

  const onSubmit = async (e) => {
      e.preventDefault();

      const createdHubInfos = {
        "hubName": hubName,
        "ownerId": loggedInUserID,
        "memberIds": [
          "61f3f2bbbaefd50dc52a96be"
        ]
      }
      
      try {
        await axios.post(
          'http://localhost:4500/hubs/createHub',
          createdHubInfos
        ) 
        navigate('/dashboard');
        /* const us = await axios.get('http://localhost:4500/users');
        console.log(us)  */
      } catch (error) {
        console.log(error.response);
        console.log(error.message);
        console.log(error.request);
      }      
  };

  const selectChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const onChange = (e) => {
    setHubName(e.target.value)
  }

  const cancelButtonHandler = () => {
    navigate('/dashboard');
  }

  return(
    <Container component="main" maxWidth="xs">
      <Box component="form" onSubmit={(e) => onSubmit(e)}>
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

        <InputLabel id="hubUsersSelectLabel">Hub users</InputLabel>
        <Select
          labelId="hubUsersSelectLabel"
          id="hubUsersSelect"
          multiple
          value={personName}
          fullWidth
          onChange={selectChange}
          renderValue={(selected) => selected.join(', ')}
          input={<OutlinedInput label="Hub users" />}
        >
          {users.map((name) => (
            <MenuItem key={name} value={name}>
              <Checkbox checked={personName.indexOf(name) > -1} />
              <ListItemText primary={name} />
            </MenuItem>
          ))}
        </Select>

        <Button
          type="submit"
          fullWidth
          variant="contained"
        >
            Create hub
        </Button>

        <Button
          onClick={cancelButtonHandler}
          fullWidth
          variant="outlined"
        >
            Cancel
        </Button>
      </Box>
    </Container>
  )}