import { HUB_CLICKED } from "../actions/types";


let user = JSON.parse(localStorage.getItem('userInfo'));
const initialState = user ? { 
    hubId: null, 
    clicked: false} : {};

export default function hubReducer (state = initialState, action){
    switch(action.type){
        case HUB_CLICKED:
            return {clicked: true, hubId:action.payload}
         default:
             return state
    }
}