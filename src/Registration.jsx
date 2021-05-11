import React from 'react'
import {Form,Button,Alert,Col} from 'react-bootstrap';

class Registration extends React.Component{

    constructor(props){
        super(props)
        let inputFieldComponent = {
            value :"",
            isValid : true,
            errorMessage : ""
        }
        this.state = {
            name : inputFieldComponent,
            email : inputFieldComponent,
            phone : inputFieldComponent,
            password : inputFieldComponent,
            isShowAlertMessage:false
        }
    }

    checkValueType(e){
        var numberPattern = new RegExp(/^[0-9]+$/i);

        if (e.key !== "Backspace"&& !numberPattern.test(e.key)) {
            e.preventDefault()
        }
    }

    setFormValue(e){
        let fName = e.target.name.toString();
        let inputFieldComponent = {
            value :e.target.value,
            isValid : true,
            errorMessage : ''
        };

        if(fName === 'name'){
            this.setState({name:inputFieldComponent});
        }else if(fName === 'email'){
            this.setState({email:inputFieldComponent});
        }else if(fName === 'phone' && inputFieldComponent.value.length <= 10){
            this.setState({phone:inputFieldComponent});
        }else if(fName === 'password'){
            this.setState({password:inputFieldComponent});
        }

    }

    submitRegistrationDetail(e){
        let validation = true
        //-------- Name validation
        if(!this.state.name.value){
            this.setState({name:{value:this.state.name.value,isValid:false,errorMessage:'Full Name can not be empty'}});
            validation = false
        }

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

        //-------- Phone validation
        if(!this.state.phone.value){
            this.setState({phone:{value:this.state.phone.value,isValid:false,errorMessage:'Phone Number can not be empty'}});
            validation = false
        }else if(this.state.phone.value.length !== 10){
            this.setState({phone:{value:this.state.phone.value,isValid:false,errorMessage:'Invalid Phone Number'}});
            validation = false
        }

        //-------- Password validation
        if(!this.state.password.value){
            this.setState({password:{value:this.state.password.value,isValid:false,errorMessage:'Password can not be empty'}});
            validation = false
        }

        //-------- sending post request for data submission
        if(validation){
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json','Access-Control-Allow-Origin':'*' },
                body: JSON.stringify({ 
                    name:  this.state.name.value,
                    email:  this.state.email.value,
                    phone:  this.state.phone.value,
                    password:  this.state.password.value
                })
            };
            fetch('http://localhost:8000/registration', requestOptions)
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
                    // console.log(data)
                    if (this.state.isStatusOK){
                        this.setState({ responseData: data.content })
                    }else{
                        this.setState({ responseData: data.error })
                    }
                    this.setState({isShowAlertMessage:true})
                    
                });
            }

        e.preventDefault();
    }
    setIsShowAlertMessage(status){
        this.setState({isShowAlertMessage:status})
    }
    render(){
        
        return(
            <>
                <h1>User Registration</h1>
                <Alert show={this.state.isShowAlertMessage} variant={this.state.isStatusOK?"success":"danger"} onClose={() => this.setIsShowAlertMessage(false)}  dismissible>{this.state.responseData}</Alert>
                <div>
                    <Form onSubmit={(e) => this.submitRegistrationDetail(e) }>
                        <Form.Row>
                            <Form.Group as={Col} xs={3} controlId="fullName-label">
                                <Form.Label>Full Name:</Form.Label>
                            </Form.Group>
                            <Form.Group as={Col} xs={5} controlId="fullName-input">
                                <Form.Control type="text" name="name" placeholder="Enter Full Name" value={this.state.name.value} onChange={(e) => this.setFormValue(e)} style={{'border-color':(this.state.name.isValid?"":"red")}}/>
                                <Form.Text><ValidationError filedInfo={this.state.name}/></Form.Text>
                            </Form.Group>
                        </Form.Row>

                        <Form.Row>
                            <Form.Group as={Col} xs={3} controlId="email-label">
                                <Form.Label>Email Address:</Form.Label>
                            </Form.Group>   
                            <Form.Group as={Col} xs={5} controlId="email-input"> 
                                <Form.Control type="text" name="email"  placeholder="Enter Email Address" value={this.state.email.value} onChange={(e) => this.setFormValue(e)} style={{'border-color':(this.state.email.isValid?"":"red")}}/>
                                <Form.Text><ValidationError filedInfo={this.state.email}/></Form.Text>
                            </Form.Group>   
                        </Form.Row>
                        
                        <Form.Row>
                            <Form.Group as={Col} xs={3} controlId="phone-label">
                                <Form.Label>Phone Number:</Form.Label>
                            </Form.Group>   
                            <Form.Group as={Col} xs={5} controlId="phone-input"> 
                                <Form.Control type="text" name="phone"  placeholder="Enter Phone Number" value={this.state.phone.value} onChange={(e) => this.setFormValue(e)} style={{'border-color':(this.state.phone.isValid?"":"red")}} />
                                <Form.Text><ValidationError filedInfo={this.state.phone}/></Form.Text>
                            </Form.Group>
                        </Form.Row>

                        <Form.Row>
                            <Form.Group as={Col} xs={3} controlId="password-label">
                                <Form.Label>Password:</Form.Label>
                            </Form.Group>   
                            <Form.Group as={Col} xs={5} controlId="password-input"> 
                                <Form.Control type="password" name="password"  placeholder="Enter Password" value={this.state.password.value} onChange={(e) => this.setFormValue(e)} style={{'border-color':(this.state.password.isValid?"":"red")}} />
                                <Form.Text><ValidationError filedInfo={this.state.password}/></Form.Text>
                            </Form.Group>   
                        </Form.Row>
                        <Button variant="primary" type="submit">Submit</Button>
                    </Form>
                </div>
            </>
        );

    }
}

function ValidationError(props){
    if (!props.filedInfo.isValid){
        return(
            <span style={{color:'red'}}>{props.filedInfo.errorMessage}</span >
        );
    }
    return null;
}

export default Registration