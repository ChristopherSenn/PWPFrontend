import logo from './logo.svg';
import './App.css';
import { Modal, Button } from 'react-materialize';
import 'materialize-css';

const trigger = <Button>Open Modal</Button>;

function App() {
  return (
    <Modal header="Modal Header" trigger={trigger}>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
  </Modal>
  );
}

export default App;
