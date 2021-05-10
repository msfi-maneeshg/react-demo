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
        console.log("validation: "+validation)
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
                    console.log("isStatusOK: "+isStatusOK)
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
    const dispatch = useDispatch();
    const userDetails = useSelector((state) => state.checkUserLogin);


    const [isEditable,setIsEditable] = useState(false);
    const clickLogout = () => {
        dispatch(callLogout());
    }

    const editUserInfo = (status) => {
        setIsEditable(status);
    }
     return(
        <>
            <Container>
                <Row>
                    <Col xs={9}><h1>Welcome to dashboard</h1></Col>
                    <Col xs={3} md={{ span: 6, offset: 3 }}><Button variant="secondary" onClick={clickLogout} block>Logout</Button></Col>
                </Row>
                <Row>
                    <Col xs={12}>
                        <Table bordered hover>
                        <tbody>
                            <tr>
                                <td>Name :</td>
                                <td>{isEditable? <input type="text" value={userDetails.name} />   :userDetails.name}</td>
                            </tr>
                            <tr>
                                <td>Email :</td>
                                <td>{isEditable? <input type="text" value={userDetails.email} />   :userDetails.email}</td>
                            </tr>
                            <tr>
                                <td>Phone :</td>
                                <td>{isEditable? <input type="text" value={userDetails.phone} />   :userDetails.phone}</td>
                            </tr>
                        </tbody>
                    </Table>
                    </Col>
                </Row>
                <Row>
                    <Col xs={3}><Button variant="info" block onClick={() => editUserInfo(!isEditable)}>{isEditable ?"Back":"Edit"}</Button></Col>
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