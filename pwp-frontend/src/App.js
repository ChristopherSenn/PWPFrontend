
import 'materialize-css';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
//pages
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'


function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/users/login" element={<Login />} />
          <Route path="/users/register" element={<Register />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
