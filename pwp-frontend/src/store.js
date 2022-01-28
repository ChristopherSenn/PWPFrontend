import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";

import {
  userLoginReducer,
  userRegisterReducer,
  usersReducer,
} from "./reducers/userReducers";
import {
  hubsReducer
} from "./reducers/hubsReducer";
// conbine all reducers
const reducer = combineReducers({
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  users: usersReducer,
  hubs : hubsReducer

});


const initialState = {};

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  applyMiddleware(...middleware)
);

export default store;