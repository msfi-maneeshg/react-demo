import {combineReducers} from 'redux'
let isLoggedin = true;
export const changeLoginStatus = (state = isLoggedin,action) => {
    if(action.type == "login"){
        return true;
    }else if (action.type == "logout"){
        return false;
    }
    return state;
}

export const CallLogin = () => {
    return{
        type:"login"
    }
}
export const callLogout = () => {
    return{
        type:"logout"
    }
}

export const rootReducer = combineReducers({
    changeLoginStatus
});
export default rootReducer;