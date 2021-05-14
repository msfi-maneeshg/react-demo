import React,{ useState }  from 'react'
import {Form,Button,Alert} from 'react-bootstrap';
import {useSelector,useDispatch} from 'react-redux';
import {callLogin} from './store/reducers';
import UserHome from './user/Home';


import {useHistory} from "react-router-dom";

function LoginPage() {   
    let history = useHistory();
    const dispatch = useDispatch();
    const loginStatus = useSelector((state) => state.checkUserLogin);
    let inputFieldComponent = {
        value :"",
        isValid : false,
        error : ""
    }
    let emailData = useHandleFormValue(inputFieldComponent);
    let passwordData = useHandleFormValue(inputFieldComponent);
    let [isShowAlertMessage, setIsShowAlertMessage] = useState(false);
    let [isSubmitting, setIsSubmitting] = useState(false);
    let [responseData,setResponseData] = useState('');
    // let [isStatusOK,setIsStatusOK] = useState(false);
     
    let closeAlertMessage = () =>{
       setIsShowAlertMessage(false);
    }

    let submitLoginDetails = (e) =>{
        setIsSubmitting(true);
        let validation = true
        var emailPattern = new RegExp(/^[a-zA-Z0-9+_.-]+[@]+[a-zA-Z0-9.-]+[.]+[a-zA-Z0-9.-]+$/i);
        //-------- Email validation
        if(!emailData.value){
            //setEmailData({value:emailData.value,isValid:false,errorMessage:'Email Address can not be empty'});
            validation = false
        }else if (!emailPattern.test(emailData.value)) {
            // setEmailData({value:emailData.value,isValid:false,errorMessage:'Please enter valid email address.'});
            validation = false
        }
    
        //-------- Password validation
        if(!passwordData.value){
            //setPasswordData({value:passwordData.value,isValid:false,errorMessage:'Password can not be empty'});
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
                        if(loginStatus.isLogin){
                            history.push("dashboard");
                        }
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

    const alertProps = {
        show:isShowAlertMessage,
        variant:"danger",
        onClose:closeAlertMessage,
        dismissible:true
    }

    return(
        <>
            <h1>Login Page</h1>
            <Alert {...alertProps}>{responseData}</Alert>
            <Form onSubmit={submitLoginDetails}>
                {/*Email Details*/} 
                <Form.Group controlId="email">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" {...emailData} name="email" placeholder="Enter email" />
                    <Form.Text><ValidationError filedInfo={emailData}/></Form.Text>
                </Form.Group>

                {/*Password Details*/} 
                <Form.Group controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password"  name="password" {...passwordData} placeholder="Password" />
                    <Form.Text><ValidationError filedInfo={passwordData}/></Form.Text>
                </Form.Group>
                
                {/*Submit details*/} 
                <Button variant="primary" type="submit" disabled={!(emailData.value && passwordData.value)}>{isSubmitting ? 'Please wait...' : 'Login'}</Button>
            </Form>
        </>
    );
}

function useHandleFormValue(initialValue){
    const [value,setValue] = useState(initialValue)
    function handleValue(e){
        let isValid = true;
        let errorText = "";
        if(!e.target.value){
            isValid = false;
            errorText = e.target.name + " can not be empty."
        }
        setValue({
            value :e.target.value,
            isValid : isValid,
            error : errorText
        })
    }

    return{
        value:value.value,
        isValid:value.isValid,
        error:value.error,
        onChange:handleValue
    };
}

function Login() {
    const loginStatus = useSelector((state) => state.checkUserLogin);
    if(loginStatus.isLogin){   
        return <UserHome />;
    }
    return <LoginPage />;
}

function ValidationError(props){
    if (!props.filedInfo.isValid && props.filedInfo.error){
        return(
            <label style={{color:'red'}}>*{props.filedInfo.error}*</label>
        );
    }
    return null;
}

export default Login