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

    getFormValue(e){
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
        }else if(fName === 'phone'){
            this.setState({phone:inputFieldComponent});
        }else if(fName === 'password'){
            this.setState({password:inputFieldComponent});
        }

    }
    submitRegistrationDetail(e){
        //-------- Name validation
        if(!this.state.name.value){
            this.setState({name:{isValid:false,errorMessage:'Full Name can not be empty'}});
        }

        //-------- Email validation
        if(!this.state.email.value){
            this.setState({email:{isValid:false,errorMessage:'Email Address can not be empty'}});
        }

        //-------- Phone validation
        if(!this.state.phone.value){
            this.setState({phone:{isValid:false,errorMessage:'Phone Number can not be empty'}});
        }

        //-------- Password validation
        if(!this.state.password.value){
            this.setState({password:{isValid:false,errorMessage:'Password can not be empty'}});
        }
        console.log(this.state);
        e.preventDefault();
    }
    render(){
        return(
            <>
                <h1>Registration Page</h1>
                <div>
                    <form onSubmit={(e) => this.submitRegistrationDetail(e) }>
                        <table>
                            <tr>
                                <td><label>Full Name:</label></td>
                                <td><input type="text" name="name" value={this.state.name.value} onChange={(e) => this.getFormValue(e)}/></td>
                                <td><ValidationError filedInfo={this.state.name}/></td>
                            </tr>
                            <tr>
                                <td><label>Email Address:</label></td>
                                <td><input type="text" name="email" value={this.state.email.value} onChange={(e) => this.getFormValue(e)}/></td>
                                <td><ValidationError filedInfo={this.state.email}/></td>
                            </tr>
                            <tr>
                                <td><label>Phone Number:</label></td>
                                <td><input type="text" name="phone" value={this.state.phone.value} onChange={(e) => this.getFormValue(e)}/></td>
                                <td><ValidationError filedInfo={this.state.phone}/></td>
                            </tr>
                            <tr>
                                <td><label>Password:</label></td>
                                <td><input type="password" name="password" value={this.state.password.value} onChange={(e) => this.getFormValue(e)}/></td>
                                <td><ValidationError filedInfo={this.state.password}/></td>
                            </tr>
                            <tr>
                                <td><input type="submit" value="Submit Details"/></td>
                            </tr>
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