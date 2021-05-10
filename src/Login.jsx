import React,{ useState }  from 'react'
import {Form,Button,Alert,Table,Container,Row,Col} from 'react-bootstrap';
import {useSelector,useDispatch} from 'react-redux';
import {callLogout,callLogin} from './store/reducers';

function LoginPage() {   
    const dispatch = useDispatch();
    let inputFieldComponent = {
        value :"",
        isValid : true,
        errorMessage : ""
    }
    let [emailData, setEmailData] = useState(inputFieldComponent);
    let [passwordData, setPasswordData] = useState(inputFieldComponent);
    let [isShowAlertMessage, setIsShowAlertMessage] = useState(false);
    let [isSubmitting, setIsSubmitting] = useState(false);
    let [responseData,setResponseData] = useState('');
    // let [isStatusOK,setIsStatusOK] = useState(false);
    

      let setFormValue = (e) =>{
       let inputFieldComponent = {
            value :e.target.value,
            isValid : true,
            errorMessage : ''
        };
        if (e.target.name === 'email'){
            setEmailData(inputFieldComponent);
        }else if (e.target.name === 'password'){
            setPasswordData(inputFieldComponent);
        }
    }
     
    
    let closeAlertMessage = () =>{
       setIsShowAlertMessage(false);
    }
    let submitLoginDetails = (e) =>{
        setIsSubmitting(true);
        let validation = true
        
        //-------- Email validation
        if(!emailData.value){
            setEmailData({value:emailData.value,isValid:false,errorMessage:'Email Address can not be empty'});
            validation = false
        }else{
            var emailPattern = new RegExp(/^[a-zA-Z0-9+_.-]+[@]+[a-zA-Z0-9.-]+[.]+[a-zA-Z0-9.-]+$/i);
            if (!emailPattern.test(emailData.value)) {
                setEmailData({value:emailData.value,isValid:false,errorMessage:'Please enter valid email address.'});
                validation = false
            }
        }
    
        //-------- Password validation
        if(!passwordData.value){
            setPasswordData({value:passwordData.value,isValid:false,errorMessage:'Password can not be empty'});
            validation = false
        }

        if(validation){
            let isStatusOK = false;
            //-------- sending post request for login
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json','Access-Control-Allow-Origin':'*' },
                body: JSON.stringify({ 
                    email:  emailData.value,
                    password:  passwordData.value
                })
            };
            fetch('http://localhost:8000/login', requestOptions)
                .then((response) => {
                    if(response.status === 200){
                        isStatusOK = true;
                    }
                    return response.json();   
                })
                .then((data) => {
                    if (isStatusOK){
                        dispatch(callLogin(data.content));
                        //----set data here after loggedin
                    }else{
                        setIsShowAlertMessage(true);
                        setResponseData(data.error);
                    }
                    
                });
        }
        setIsSubmitting(false);
        e.preventDefault();
    }

    return(
        <>
            <h1>Login Page</h1>
            <Alert show={isShowAlertMessage} variant='danger' onClose={closeAlertMessage}  dismissible>{responseData}</Alert>
            <Form onSubmit={submitLoginDetails}>
                {/*Email Details*/} 
                <Form.Group controlId="email">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" value={emailData.value} name="email" onChange={setFormValue} placeholder="Enter email" />
                    <Form.Text><ValidationError filedInfo={emailData}/></Form.Text>
                </Form.Group>

                {/*Password Details*/} 
                <Form.Group controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" value={passwordData.value} name="password" onChange={setFormValue} placeholder="Password" />
                    <Form.Text><ValidationError filedInfo={passwordData}/></Form.Text>
                </Form.Group>
                
                {/*Submit details*/} 
                <Button variant="primary" type="submit">{isSubmitting ? 'Please wait...' : 'Login'}</Button>
            </Form>
        </>
    );
}

function Login() {
    const loginStatus = useSelector((state) => state.checkUserLogin);
    if(loginStatus.isLogin){   
        return <UserDashboard />;
    }
    return <LoginPage />;
}

function UserDashboard(props){
    let inputFieldComponent = {
        value :"",
        isValid : true,
        errorMessage : ""
    }
    
    const dispatch = useDispatch();
    const userDetails = useSelector((state) => state.checkUserLogin);
    const [isEditable,setIsEditable] = useState(false);
    let [nameData, setNameData] = useState(inputFieldComponent = {value:userDetails.name,isValid : true,errorMessage : ""});
    let [phoneData, setPhoneData] = useState(inputFieldComponent = {value:userDetails.phone,isValid : true,errorMessage : ""});
    let [isShowAlertMessage, setIsShowAlertMessage] = useState(false);
    let [responseData,setResponseData] = useState('');
    let [alertVariant,setAlertVariant] = useState(false);
    const clickLogout = () => {
        dispatch(callLogout());
    }

    const checkValueType = (e) => {
        var numberPattern = new RegExp(/^[0-9]+$/i);

        if (e.key !== "Backspace" && !numberPattern.test(e.key)) {
            e.preventDefault()
        }
    }

    const handleUserDetails = (e) => {
        inputFieldComponent = {
            value :e.target.value,
            isValid : true,
            errorMessage : ''
        };
        if (e.target.name === 'name'){
            setNameData(inputFieldComponent);
        }else if (e.target.name === 'phone' && inputFieldComponent.value.length <= 10){
            setPhoneData(inputFieldComponent);
        } 
    }

    const updateUserDetails = () => {
        let validation = true
        //-------- Name validation
        if(!nameData.value){
            setNameData({value:nameData.value,isValid:false,errorMessage:'Full Name can not be empty'});
            validation = false
        }

        //-------- Phone validation
        if(!phoneData.value){
            setPhoneData({value:phoneData.value,isValid:false,errorMessage:'Phone Number can not be empty'});
            validation = false
        }

        if(validation){
            let isStatusOK = false;
            //-------- sending post request for login
            const requestOptions = {
                method: 'UPDATE',
                headers: { 'Content-Type': 'application/json','Access-Control-Allow-Origin':'*' },
                body: JSON.stringify({ 
                    name:  nameData.value,
                    phone:  phoneData.value
                })
            };
            fetch('http://localhost:8000/update-detail/'+userDetails.id, requestOptions)
                .then((response) => {
                    if(response.status === 200){
                        isStatusOK = true;
                    }
                    return response.json();   
                })
                .then((data) => {
                    if (isStatusOK){
                        setIsShowAlertMessage(true);
                        setResponseData(data.content);
                        setAlertVariant("success");
                        dispatch(callLogin({
                            name:nameData.value,
                            email:userDetails.email,
                            id:userDetails.id,
                            phone:phoneData.value,
                        }))
                    }else{
                        setIsShowAlertMessage(true);
                        setResponseData(data.error);
                        setAlertVariant("danger");
                    }
                    
                });
        }
    }

    const editUserDetails = (status) => {
        setNameData({value:userDetails.name,isValid : true});    
        setPhoneData({value:userDetails.phone,isValid : true});    
        setIsEditable(status);
        setIsShowAlertMessage(false);
    }

     return(
        <>
            <Container>
                <Row>
                    <Col xs={9}><h1>Welcome to dashboard</h1></Col>
                    <Col xs={3}><Button variant="secondary" onClick={clickLogout} block>Logout</Button></Col>
                </Row>
                <Row>
                    <Col xs={12}>
                        <Alert show={isShowAlertMessage} variant={alertVariant} onClose={() => setIsShowAlertMessage(false)}  dismissible>{responseData}</Alert>
                        <Table bordered hover>
                        <tbody>
                            <tr>
                                <td>Name :</td>
                                <td>{isEditable? <><input type="text" name="name" value={nameData.value} onChange={(e) => handleUserDetails(e)} /> <ValidationError filedInfo={nameData}/></>:userDetails.name}</td>
                            </tr>
                            <tr>
                                <td>Email :</td>
                                <td>{userDetails.email}</td>
                            </tr>
                            <tr>
                                <td>Phone :</td>
                                <td>{isEditable? <><input type="text" name="phone" value={phoneData.value} onChange={(e) => handleUserDetails(e)} onKeyDown={(e) => checkValueType(e)} /> <ValidationError filedInfo={phoneData}/></>:userDetails.phone}</td>
                            </tr>
                        </tbody>
                    </Table>
                    </Col>
                </Row>
                <Row>
                    <Col xs={3}><Button variant="info" block onClick={() => editUserDetails(!isEditable)}>{isEditable ?"Back":"Edit info"}</Button></Col>
                    {isEditable && <Col xs={3}><Button variant="success " block onClick={() => updateUserDetails()}>Submit</Button></Col>}
                </Row>
            </Container>
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