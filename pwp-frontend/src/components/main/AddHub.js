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
import { authHeader } from '../../utilis/setToken'
import { useSelector } from "react-redux";
import Typography from '@mui/material/Typography';

export default function AddHub() {

  // Man müsste eig nur noch die user-Liste ziehen und anstatt der Dummy-Liste an die Select-Box weiterreichen und dann eben mit dem Form die createHub füttern
  const userLogin = useSelector((state) => state.userLogin);
  const { user } = userLogin;

  const [hubName, setHubName] = useState('');
  const [personName, setPersonName] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const navigate = useNavigate();

  const requestOptions = {
    headers: authHeader()
  };
  const listOfUsers = []

  useEffect(() => {
    getAllUsers()
  }, []);

  const getAllUsers = async () => {
    try {
      const res = await axios.get('http://localhost:4500/users', requestOptions);
      for (let item of res.data) {
        listOfUsers.push(item.id)
      }
      setAllUsers(listOfUsers)
    } catch (error) {
      console.log(error.request)
    }

  }


  const onSubmit = async (e) => {
    e.preventDefault();
    const createdHubInfos = {
      "hubName": hubName,
      "ownerId": user.id,
      "memberIds": personName
    }

    try {
      await axios.post(
        'http://localhost:4500/hubs/createHub',
        createdHubInfos
      )
      navigate('/dashboard');
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

  return (
    <Container component="main" maxWidth="xs">
      <Box component="form" onSubmit={(e) => onSubmit(e)} sx={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
      }}>
        <Typography component="h1" variant="h5"  sx={{ mt: 1, alignItems: 'center'}}>
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
            value={personName}
            fullWidth
            onChange={selectChange}
            renderValue={(selected) => selected.join(', ')}
            input={<OutlinedInput label="All Users" />}
          >
            {allUsers.map((name) => (
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
            sx={{ mt: 1 }}
          >
            Create hub
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
    </Container>
  )
}