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

function App() {

  return (
    <BrowserRouter>
        <Routes>
          <Route path="/users/login" element={<Login />} />
          <Route path="/users/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
