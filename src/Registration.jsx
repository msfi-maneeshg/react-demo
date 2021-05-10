import React from 'react'

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
            password : inputFieldComponent
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
                    
                });
            }

        e.preventDefault();
    }
    render(){
        
        return(
            <>
                <h1>-:Registration Page :-</h1>
                <label style={{color:(this.state.isStatusOK?"green":"red")}}>{this.state.responseData}</label>
                <div>
                    <form onSubmit={(e) => this.submitRegistrationDetail(e) }>
                        <table>
                            <tbody>
                                <tr>
                                    <td><label>Full Name:</label></td>
                                    <td><input type="text" name="name" value={this.state.name.value} onChange={(e) => this.setFormValue(e)}/></td>
                                    <td><ValidationError filedInfo={this.state.name}/></td>
                                </tr>
                                <tr>
                                    <td><label>Email Address:</label></td>
                                    <td><input type="text" name="email" value={this.state.email.value} onChange={(e) => this.setFormValue(e)}/></td>
                                    <td><ValidationError filedInfo={this.state.email}/></td>
                                </tr>
                                <tr>
                                    <td><label>Phone Number:</label></td>
                                    <td><input type="text" name="phone" value={this.state.phone.value} onChange={(e) => this.setFormValue(e)} onKeyDown={(e)=>this.checkValueType(e)}/></td>
                                    <td><ValidationError filedInfo={this.state.phone}/></td>
                                </tr>
                                <tr>
                                    <td><label>Password:</label></td>
                                    <td><input type="password" name="password" value={this.state.password.value} onChange={(e) => this.setFormValue(e)}/></td>
                                    <td><ValidationError filedInfo={this.state.password}/></td>
                                </tr>
                                <tr>
                                    <td><input type="submit" value="Submit Details"/></td>
                                </tr>
                            </tbody>
                        </table>
                    </form>
                </div>
            </>
        );

    }
}

function ValidationError(props){
    if (!props.filedInfo.isValid){
        return(
            <label style={{color:'red'}}>*{props.filedInfo.errorMessage}*</label>
        );
    }
    return null;
}

export default Registration