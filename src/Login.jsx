import React from 'react'
import {Form,Button,Alert   } from 'react-bootstrap';

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
            isLogin : false,
            isShowAlertMessage:false
        }
    }
    setFormValue(e){
        this.setState({isSubmit:false})
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
                        this.setState({ responseData: data.error,isLogin:false,isShowAlertMessage :true })
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

    closeAlertMessage(){
        this.setState({isShowAlertMessage :false})
    }
    render(){
        
        if(this.state.isLogin){
            return(
                <UserDashboard userData={this.state.responseData} onClick={() => this.props.onClick()} />
            );
        }else{
            return(
                <>
                    <h1>Login Page</h1>
                    <Alert show={this.state.isShowAlertMessage} variant='danger' onClose={() => this.closeAlertMessage()}  dismissible>{this.state.responseData}</Alert>
                    <Form onSubmit={(e) => this.submitLoginDetails(e)}>
                        <Form.Group controlId="email">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" value={this.state.email.value} name="email" onChange={(e)=> this.setFormValue(e)} placeholder="Enter email" />
                            <Form.Text><ValidationError filedInfo={this.state.email}/></Form.Text>
                        </Form.Group>

                        <Form.Group controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" value={this.state.password.value} name="password" onChange={(e)=> this.setFormValue(e)} placeholder="Password" />
                            <Form.Text><ValidationError filedInfo={this.state.password}/></Form.Text>
                        </Form.Group>
                        <Button variant="primary" type="submit">Login</Button>
                    </Form>
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