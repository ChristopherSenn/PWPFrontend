import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import hubReducer from "./reducers/hubReducer";

import {
  userLoginReducer,
  userRegisterReducer,
} from "./reducers/userReducers";

// conbine all reducers
const reducer = combineReducers({
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  hubClicked: hubReducer
});


const initialState = {};

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  applyMiddleware(...middleware)
);

export default store;