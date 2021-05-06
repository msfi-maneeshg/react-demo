import React from 'react'

class Login extends React.Component{
    constructor(props){
        super(props)
        let inputFieldComponent = {
            value :"",
            isValid : true,
            errorMessage : ""
        }
        this.state = {
            email : inputFieldComponent,
            password:inputFieldComponent,
            isLogin : false
        }
    }
    setFormValue(e){
        let inputFieldComponent = {
            value :e.target.value,
            isValid : true,
            errorMessage : ''
        };
        if (e.target.name === 'email'){
            this.setState({email:inputFieldComponent});
        }else if (e.target.name === 'password'){
            this.setState({password:inputFieldComponent});
        }
    }

    submitLoginDetails(e){
        let validation = true
        //-------- Email validation
        if(!this.state.email.value){
            this.setState({email:{value:this.state.email.value,isValid:false,errorMessage:'Email Address can not be empty'}});
            validation = false
        }else{
            var emailPattern = new RegExp(/^[a-zA-Z0-9+_.-]+[@]+[a-zA-Z0-9.-]+[.]+[a-zA-Z0-9.-]+$/i);

            if (!emailPattern.test(this.state.email.value)) {
                this.setState({email:{value:this.state.email.value,isValid:false,errorMessage:'Please enter valid email address.'}});
                validation = false
            }

        }

         //-------- Password validation
         if(!this.state.password.value){
            this.setState({password:{value:this.state.password.value,isValid:false,errorMessage:'Password can not be empty'}});
            validation = false
        }
        if(validation){
            this.setState({isSubmit:true})
            //-------- sending post request for login
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json','Access-Control-Allow-Origin':'*' },
                body: JSON.stringify({ 
                    email:  this.state.email.value,
                    password:  this.state.password.value
                })
            };
            fetch('http://localhost:8000/login', requestOptions)
                .then((response) => {
                    const data = response.json()
                    if(response.status === 200){
                        this.setState({ isStatusOK: true })
                    }else {
                        this.setState({ isStatusOK: false })
                    }  
                    return data   
                })
                .then((data) => {
                    console.log(data)
                    if (this.state.isStatusOK){
                        this.setState({ responseData: data.content,isLogin:true })
                    }else{
                        this.setState({ responseData: data.error,isLogin:false })
                    }
                    
                });
                
        }
        e.preventDefault();
    }

    logoutUser(){
        let inputFieldComponent = {
            value :"",
            isValid : true,
            errorMessage : ""
        }
        this.setState({
            isLogin:false,
            isSubmit:false,
            email : inputFieldComponent,
            password : inputFieldComponent
        })

    }

    render(){
        if(this.state.isLogin){
            return(
                <UserDashboard userData={this.state.responseData} onClick={() => this.logoutUser()} />
            );
        }else{
            return(
                <>
                    <h1>Login Page</h1>
                   {this.state.isSubmit?(<label style={{color:(this.state.isStatusOK?"green":"red")}}>{this.state.responseData}</label>):''}
                    <form onSubmit={(e) => this.submitLoginDetails(e)}>
                        <table>
                            <tbody>
                                <tr>
                                    <td>Email ID:</td>
                                    <td><input type="text" value={this.state.email.value} name="email" onChange={(e)=> this.setFormValue(e)} /></td>
                                    <td><ValidationError filedInfo={this.state.email}/></td>
                                </tr>
                                <tr>
                                    <td>Password:</td> 
                                    <td><input type="password" value={this.state.password.value} name="password" onChange={(e)=> this.setFormValue(e)} /></td>
                                    <td><ValidationError filedInfo={this.state.password}/></td>
                                </tr>
                                <tr>
                                    <td><input type="submit" value="Login" /></td>
                                </tr>
                            </tbody>
                        </table>
                    </form>
                </>
            );
        }
    }
}



function UserDashboard(props){
     return(
        <>
            <h1>Welcome, {props.userData.name}</h1>
           <button onClick={props.onClick}>Logout</button>
        </>
    );
}


function ValidationError(props){
    if (!props.filedInfo.isValid){
        return(
            <label style={{color:'red'}}>*{props.filedInfo.errorMessage}*</label>
        );
    }
    return null;
}

export default Login