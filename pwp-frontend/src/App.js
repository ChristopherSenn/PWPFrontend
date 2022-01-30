import 'materialize-css';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import React from 'react';
//pages
import Login from './components/authentification/Login'
import Register from './components/authentification/Register'
import Dashboard from './components/main/Dashboard';
import SecurityExplanation from './components/main/securityExplanation';
import LandingPage from './components/main/landingPage';
import AddHub from './components/main/AddHub';
import EditHub from './components/main/EditHub';


function App() {

  return (
    <BrowserRouter>
        <Routes>
        <Route path="/" element={<LandingPage />} />
          <Route path="/users/login" element={<Login />} />
          <Route path="/users/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/securityExplanation" element={<SecurityExplanation />} />
          <Route path="/add-hub" element={<AddHub />} />
          <Route path="/edit-hub" element={<EditHub />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
