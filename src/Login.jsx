import React from 'react'

// class Login extends React.Component{

//     // constructor(props){
//     //     super(props)
//     // }

//     render(){
//         if(this.props.isLoggedin){
//             return <UserDashboard/>
//         }else{
//             return <UserLogin/>
//         }
//     }
// }


function UserLogin(props){
    return(
        <>
            <h1>Login Page</h1>
            <button onClick={props.onClick}>Login</button>
        </>
    );
}

function UserDashboard(props){
    return(
        <>
            <h1>UserDashboard</h1>
            <h1>You have {props.messages.length} unreaded messages.</h1>
            <button onClick={props.onClick}>Logout</button>
        </>
    );
}

class LoginControl extends React.Component{
    constructor(props){
        super(props);
        this.state = {isLoggedin : false};
    }

    logoutClick(){
        this.setState({isLoggedin:false})
    }

    loginClick(){
        this.setState({isLoggedin:true})
    }

    render(){
        const isLoggedin = this.state.isLoggedin;
        const messages = ["Hi","Hello","Hey"];

        if(isLoggedin){
            return <UserDashboard onClick={() => this.logoutClick()} messages={messages} />
        }else{
            return <UserLogin onClick={() => this.loginClick()} />
        }
        
    }
}

export default LoginControl