import 'materialize-css';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
//pages
import Login from './components/authentification/Login'
import Register from './components/authentification/Register'
import Dashboard from './components/main/Dashboard';
import LandingPage from './components/main/landingPage'
import Features from './components/mqttListener/mqttClient';
import DeviceOverview from './components/deviceManager/DeviceOverview';
function App() {

  return (
    <BrowserRouter>
        <Routes>
        <Route path="/" element={<LandingPage />} />
          <Route path="/users/login" element={<Login />} />
          <Route path="/users/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/features" element={<Features />} />
          <Route path="/deviceOverview" element={<DeviceOverview />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;