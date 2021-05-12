import {combineReducers} from 'redux'
let userInformation = {
    id:"",
    isLogin:false
};

//-----------login logout reducers
export const checkUserLogin = (state = userInformation,action) => {
     if(action.type === "login"){
        userInformation.id = action.payload.id;
        userInformation.isLogin = true;
        
        return userInformation;
    }else if (action.type === "logout"){
        userInformation.id = "";
        userInformation.isLogin = false;
        return userInformation;
    }
    return state;
}

export const callLogin = (userData) => {
    return{
        type:"login",
        payload:userData,
    }
}
export const callLogout = () => {
    return{
        type:"logout"
    }
}

export const rootReducer = combineReducers({
    checkUserLogin,
});
export default rootReducer;