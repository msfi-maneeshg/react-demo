import React,{ useState,useRef,useEffect }  from 'react'
import {Form,Button,Alert,Table,Container,Row,Col,Modal,Card,Image} from 'react-bootstrap';
import {useSelector,useDispatch} from 'react-redux';
import {callLogout,callLogin} from '../store/reducers';
// import thumbsUpLogoSolid from '../images/thumbs-up-solid.svg';
// import commentLogoSolid from '../images/comment-solid.svg';
import thumbsUpLogo from '../images/thumbs-up-regular.svg';
import commentLogo from '../images/comment-regular.svg';

function UserHome(props){
    let [isListLoaded,setIsListLoaded] = useState(false)
    let [usersFeed,setUsersFeed] = useState(null)


    useEffect(() =>{
        if(isListLoaded){
            return
        }
        let isStatusOK = false;
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json','Access-Control-Allow-Origin':'*' }
        };
        fetch('http://localhost:8000/user-list', requestOptions)
            .then((response) => {
                const data = response.json()
                if(response.status === 200){
                    isStatusOK = true
                }  
                return data   
            })
            .then((data) => {
                if (isStatusOK){
                    setIsListLoaded(true)
                    setUsersFeed(data.content)
                } 
            });
    })

    

    return(
        <Container>
            <Row className="justify-content-center">
                <Col xs={10}>
                    {isListLoaded && usersFeed !== null?<>{
                            usersFeed.map(feed => (
                                <UserFeed userInfo={feed}/>
                            ))  
                        }</>:"Loading"
                    }
                </Col>
            </Row>
        </Container>
    );
}

export function UserProfile(props){
    let inputFieldComponent = {
        value :null,
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
    let [showChangePasswordModal,setShowChangePasswordModal] = useState(false);
    let [profileImage,setProfileImage] = useState(inputFieldComponent);

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
        } else if (e.target.name === 'profileImage'){
            const reader = new FileReader();
            reader.onload = _handleReaderLoaded
            reader.readAsBinaryString(e.target.files[0])
            
        } 
        console.log(e.target.files[0]);
        
    }
    
    const _handleReaderLoaded = (readerEvt) => {
        let binaryString = readerEvt.target.result;
        let  inputFieldComponent = {
            value :btoa(binaryString),
            isValid : true,
            errorMessage : ''
        };
        
        setProfileImage(inputFieldComponent);
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
                    phone:  phoneData.value,
                    profileImage:  profileImage.value,
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
                            profileImage:nameData.value+".jpg"
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
        setProfileImage({value:null,isValid : true});    
        setIsEditable(status);
        setIsShowAlertMessage(false);
    }

    return(
        <>
            <Container style={{marginTop:'5px'}}>
                <Row>
                    <Col xs={9}><h1>My Profile</h1></Col>
                    <Col xs={3}><Button variant="secondary" onClick={clickLogout} block>Logout</Button></Col>
                </Row>
                <Row>
                    <Col xs={12}>
                        <Alert show={isShowAlertMessage} variant={alertVariant} onClose={() => setIsShowAlertMessage(false)}  dismissible>{responseData}</Alert>
                        <Table bordered hover>
                        <tbody>
                            <tr>
                                <td>Name :</td>
                                <td>{isEditable? <><Form.Control type="text" name="name" value={nameData.value} onChange={(e) => handleUserDetails(e)} /> <ValidationError filedInfo={nameData}/></>:userDetails.name}</td>
                            </tr>
                            <tr>
                                <td>Email :</td>
                                <td>{userDetails.email}</td>
                            </tr>
                            <tr>
                                <td>Phone :</td>
                                <td>{isEditable? <><Form.Control type="text" name="phone" value={phoneData.value} onChange={(e) => handleUserDetails(e)} onKeyDown={(e) => checkValueType(e)} /> <ValidationError filedInfo={phoneData}/></>:userDetails.phone}</td>
                            </tr>

                            <tr>
                                <td>Profile Image :</td>
                                <td>{isEditable? <><Form.File name="profileImage" onChange={(e) => handleUserDetails(e)}  /></>:<Image width="100" height="100" alt="" src={"http://localhost:8000/image/"+userDetails.profileImage} thumbnail />}</td>
                            </tr>
                        </tbody>
                    </Table>
                    </Col>
                </Row>
                <Row>
                    <Col xs={6} md={3}><Button variant="info" block onClick={() => editUserDetails(!isEditable)}>{isEditable ?"Back":"Edit Profile"}</Button></Col>
                    {isEditable && <Col xs={6} md={3}><Button variant="success " block onClick={() => updateUserDetails()}>Submit</Button></Col>}
                    {!isEditable && <Col xs={6} md={3}><Button variant="info " block onClick={() => setShowChangePasswordModal(true)}>Change Password</Button></Col>}
                </Row>

                <ChangePasswordModal userID={userDetails.id} show={showChangePasswordModal} onHide={() => setShowChangePasswordModal(false)}/>
            </Container>
        </>
    );
}

function ChangePasswordModal(props) {
    let [password,setPassword] = useState({value:"",error:""});
    let [confirmPassword,setConfirmPassword] = useState({value:"",error:""});
    let [alertMessage,setAlertMessage] = useState({type:"",message:""})
    const changePasswordform = useRef(null)
       
    let setFormValue = (e) => {
        if (e.target.name === 'password'){
            setPassword({value:e.target.value,error:""});
        }else if (e.target.name === 'confirmPassword'){
            setConfirmPassword({value:e.target.value,error:""});
        }
        setAlertMessage({type:"",message:""})
    }
    let resetForm = () => {
        setPassword({value:"",error:""});
        setConfirmPassword({value:"",error:""});
        setAlertMessage({type:"",message:""});
    }

    let submitNewPassword = (e) =>{
        let validation  = true;
        if(!password.value){
            setPassword({value:password.value,error:"Please enter new password"});
            validation = false
        }
        if(!confirmPassword.value){
            setConfirmPassword({value:confirmPassword.value,error:"Please re-enter new password"});
            validation = false
        }

        if (password.value && confirmPassword.value  && password.value !== confirmPassword.value){
            setAlertMessage({type:"error",message:"Password is not matching."})
            validation = false
        }

        if(validation){
            let isStatusOK = false;
           
            
            //-------- sending post request change password
            const data = new FormData(changePasswordform.current)
            console.log(data);
            const requestOptions = {
                method: 'UPDATE',
                headers: { 'Content-Disposition':'form-data','Access-Control-Allow-Origin':'*' },
                body: data
            };
            fetch('http://localhost:8000/update-password/'+props.userID, requestOptions)
                .then((response) => {
                    if(response.status === 200){
                        isStatusOK = true;
                    }
                    return response.json();   
                })
                .then((data) => {
                    if (isStatusOK){
                        setAlertMessage({type:"success",message:data.content})
                    }else{
                        setAlertMessage({type:"success",message:data.error})
                    }
                    
                });
                
        }
        
        e.preventDefault();   
    }
    let closeModal = () => {
        resetForm()
        props.onHide();
    }
    return (
      <Modal show={props.show} onHide={closeModal} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Change Password
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {alertMessage.message && <label style={{width:'100%',textAlign: 'center',color:(alertMessage.type === 'error'?'red':'green')}}>{alertMessage.message}</label>}
            <Form ref={changePasswordform} onSubmit={(e) => submitNewPassword(e) }>
                <Form.Row>
                    <Form.Group as={Col} xs={4} controlId="password-label">
                        <Form.Label>New Password:</Form.Label>
                    </Form.Group>
                    <Form.Group as={Col} xs={6} controlId="password-input">
                        <Form.Control type="password" name="password" placeholder="Enter Password" value={password.value} onChange={(e) => setFormValue(e)} style={{'border-color':(!password.error?"":"red")}}/>
                        <Form.Text>{password.error && <label style={{color:'red'}}>{password.error}</label>}</Form.Text>
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group as={Col} xs={4} controlId="confirm-password-label">
                        <Form.Label>Confirm Password:</Form.Label>
                    </Form.Group>
                    <Form.Group as={Col} xs={6} controlId="confirm-password-input">
                        <Form.Control type="password" name="confirmPassword" placeholder="Re-enter Password" value={confirmPassword.value} onChange={(e) => setFormValue(e)} style={{'border-color':(!confirmPassword.error?"":"red")}}/>
                        <Form.Text>{confirmPassword.error && <label style={{color:'red'}}>{confirmPassword.error}</label>}</Form.Text>
                    </Form.Group>
                </Form.Row>
                <Button type="submit" >Submit</Button>
            </Form>
        </Modal.Body>
      </Modal>
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

function UserFeed(props){
    return(
        <Card style={{margin:"5px"}}>
            <Card.Header >
                <Row>
                    <Col xs={2} md={2} >
                        <Image width="50" src={"http://localhost:8000/image/"+props.userInfo.profileImage} roundedCircle />
                    </Col>
                    <Col xs={6} md={6} >
                        <h1>{props.userInfo.name}</h1>
                    </Col>
                </Row>
            </Card.Header>
            <Card.Body>
                <Card.Text>
                Some quick example text to build on the card title and make up the bulk of
                the card's content.
                </Card.Text>
                <Card.Img variant="top" height="250" src={"https://picsum.photos/1000/1000?"+props.userInfo.id} thumbnail />
            </Card.Body>
            <Card.Footer>
                <Row>
                    <Col xs={1} md={1} >
                        <Image alt="" src={thumbsUpLogo} />
                    </Col>
                    <Col xs={1} md={1} >
                        <Image  alt="" src={commentLogo} />
                    </Col>
                </Row>
            </Card.Footer>
        </Card>
    );
}

export default UserHome;