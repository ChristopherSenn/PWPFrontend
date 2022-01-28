import {
GET_HUBS,
HUBS_ERROR
  } from "../actions/types";
let user = JSON.parse(localStorage.getItem('userInfo'));
const initialState = user ? { hubs:[], hubsByUserId:[], loading:true } : {};
// reducers for all users
export const hubsReducer = (state =initialState, action) => {
    switch (action.type) {
      case GET_HUBS:
        return {loading: false, hubs: action.payload };
      case HUBS_ERROR:
        return {};
      default:
        return state;
    }
  }