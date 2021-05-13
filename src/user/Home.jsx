import React,{ useState,useRef,useEffect }  from 'react'
import {Form,Button,Alert,Table,Container,Row,Col,Modal,Card,Image} from 'react-bootstrap';
import {useSelector,useDispatch} from 'react-redux';
import {callLogout} from '../store/reducers';
// import thumbsUpLogoSolid from '../images/thumbs-up-solid.svg';
// import commentLogoSolid from '../images/comment-solid.svg';
import thumbsUpLogo from '../images/thumbs-up-regular.svg';
import commentLogo from '../images/comment-regular.svg';
import {useParams,useHistory } from 'react-router-dom'
import  '../style.css';

export function UserHome(props){
    
    let [isListLoaded,setIsListLoaded] = useState(false)
    let [usersFeed,setUsersFeed] = useState(null)
    let [error,setError] = useState("")


    useEffect(() =>{
        if(isListLoaded){
            return
        }
        let isStatusOK;
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json','Access-Control-Allow-Origin':'*' }
        };
        fetch('http://localhost:8000/get-post', requestOptions)
            .then((response) => {
                const data = response.json()
                isStatusOK = response.status
                
                return data   
            })
            .then((data) => {
                if (isStatusOK === 200){
                    setUsersFeed(data.content)
                }else if (isStatusOK === 204){
                    setError(data.error)
                }else{
                    setError("Something went wronge!")
                }
                setIsListLoaded(true)
            });
    })

    let allUserFeed;
    if(usersFeed !== null){
        allUserFeed = usersFeed.map(feed => (
            <UserFeed userInfo={feed} key={feed.id}/>
        ))  
    }
    

    return(
        <Container className="post-main">
            <Row className="justify-content-center post-row">
                <Col xs={10}>
                    <AddNewPost/>
                </Col>
                <Col xs={10}>
                    { (isListLoaded && usersFeed !== null)?allUserFeed:<span>{error?error:"Loading..."}</span>}
                </Col>
            </Row>
        </Container>
    );
}

export function UserProfile(props){
    let history = useHistory();
    let {id}  = useParams();
    let inputFieldComponent = {
        value :null,
        isValid : true,
        errorMessage : ""
    }
    
    const dispatch = useDispatch();
    const userDetails = useSelector((state) => state.checkUserLogin);
    const [isEditable,setIsEditable] = useState(false);
    let [nameData, setNameData] = useState(inputFieldComponent);
    let [emailData, setEmailData] = useState(inputFieldComponent);
    let [phoneData, setPhoneData] = useState(inputFieldComponent);
    let [isShowAlertMessage, setIsShowAlertMessage] = useState(false);
    let [responseData,setResponseData] = useState('');
    let [alertVariant,setAlertVariant] = useState(false);
    let [showChangePasswordModal,setShowChangePasswordModal] = useState(false);
    let [profileImage,setProfileImage] = useState({
        value :'',
        binaryString:null,
        isValid : true,
        errorMessage : ''
    });
    let [isLoading,setIsloading] = useState(false)
    let [profileInputName,setProfileInputName] = useState("")

    const clickLogout = () => {
        dispatch(callLogout());
        history.push("/");
    }

    useEffect(() =>{ 
        if(isLoading){
            return
        }
        let isStatusOK = false;
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json','Access-Control-Allow-Origin':'*' }
        };
        let userID  = id?id:userDetails.id;
        fetch('http://localhost:8000/user-detail/'+userID, requestOptions)
            .then((response) => {
                const data = response.json()
                if(response.status === 200){
                    isStatusOK = true
                }  
                return data   
            })
            .then((data) => {
                if (isStatusOK){
                    setIsloading(true)
                    setNameData({ value :data.content.name,isValid : true,errorMessage : ''})
                    setEmailData({ value :data.content.email,isValid : true,errorMessage : ''})
                    setPhoneData({ value :data.content.phone,isValid : true,errorMessage : ''})
                    setProfileImage({ value :data.content.profileImage,isValid : true,errorMessage : ''})
                } 
            });
    })

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
            
            setProfileInputName(e.target.files[0].name)
            const profileReader = new FileReader();
            profileReader.onload = _handleReaderLoaded
            profileReader.readAsBinaryString(e.target.files[0])
            
        } 
        
    }
    
    const _handleReaderLoaded = (readerEvt) => {
        let binaryString = readerEvt.target.result;
        let  inputFieldComponent = {
            value :profileImage.value,
            binaryString:btoa(binaryString),
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
                    profileImage:  profileImage.binaryString,
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
        setIsloading(false)
    }

    return(
        <>
            <Container style={{marginTop:'5px'}}>
            {id?
                <Row>
                    <Col xs={9}><h1>Profile</h1></Col>
                    <Col xs={3}><Button variant="secondary" onClick={() => history.push("/user-list")} block>Back</Button></Col>
                </Row>
                :
                <Row>
                <Col xs={9}><h1>My Profile</h1></Col>
                <Col xs={3}><Button variant="secondary" onClick={clickLogout} block>Logout</Button></Col>
            </Row>
                
                }
                <Row>
                    <Col xs={12}>
                        <Alert show={isShowAlertMessage} variant={alertVariant} onClose={() => setIsShowAlertMessage(false)}  dismissible>{responseData}</Alert>
                        <Table bordered hover>
                        <tbody>
                            <tr>
                                <td>Name :</td>
                                <td>{isEditable? <><Form.Control type="text" name="name" value={nameData.value} onChange={(e) => handleUserDetails(e)} /> <ValidationError filedInfo={nameData}/></>:nameData.value}</td>
                            </tr>
                            <tr>
                                <td>Email :</td>
                                <td>{emailData.value}</td>
                            </tr>
                            <tr>
                                <td>Phone :</td>
                                <td>{isEditable? <><Form.Control type="text" name="phone" value={phoneData.value} onChange={(e) => handleUserDetails(e)} onKeyDown={(e) => checkValueType(e)} /> <ValidationError filedInfo={phoneData}/></>:phoneData.value}</td>
                            </tr>

                            <tr>
                                <td>Profile Image :</td>
                                <td>{isEditable? <><Form.File name="profileImage" onChange={(e) => handleUserDetails(e)}  custom label={profileInputName?profileInputName:"Select New Image"}/></>:<Image width="100" height="100" alt="" src={"http://localhost:8000/image/profile/"+profileImage.value} thumbnail />}</td>
                            </tr>
                        </tbody>
                    </Table>
                    </Col>
                </Row>
                {!id&&
                <Row>
                    <Col xs={6} md={3}><Button variant="info" block onClick={() => editUserDetails(!isEditable)}>{isEditable ?"Back":"Edit Profile"}</Button></Col>
                    {isEditable && <Col xs={6} md={3}><Button variant="success " block onClick={() => updateUserDetails()}>Submit</Button></Col>}
                    {!isEditable && <Col xs={6} md={3}><Button variant="info " block onClick={() => setShowChangePasswordModal(true)}>Change Password</Button></Col>}
                </Row>
                }
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
                        <Form.Control type="password" name="password" placeholder="Enter Password" value={password.value} onChange={(e) => setFormValue(e)} style={{borderColor:(!password.error?"":"red")}}/>
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
        <Card style={{margin:"5px" }}>
            <Card.Header >
                <Row>
                    <Col xs={2} md={2} >
                        <Image width="50" src={"http://localhost:8000/image/profile/"+props.userInfo.profileImage} roundedCircle />
                    </Col>
                    <Col xs={6} md={6} >
                        <h1>{props.userInfo.name}</h1>
                    </Col>
                </Row>
            </Card.Header>
            <Card.Body>
                {props.userInfo.content && <Card.Text>{props.userInfo.content}</Card.Text>}
                {props.userInfo.image && <Card.Img className="img-thumbnail" variant="top" height="50" src={"http://localhost:8000/image/post/"+props.userInfo.image} />}
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

function AddNewPost(props){
    const loggedinUser = useSelector((state) => state.checkUserLogin);
    let [isUserProfileLoaded,setIsUserProfileLoaded] = useState(false)
    let [userProfile,setUserProfile] = useState(null)
    let [postImage,setPostImage] = useState(null)
    let [postContent,setPostContent] = useState(null)
    let [postButton,setPostButton] = useState(false)
    let [postError,setPostError] = useState({color:"",message:""})


    const addNewPost = useRef(null)
    useEffect(() => {
        if(postError.message){
            setInterval(() =>setPostError({color:"",message:""}),5000);
        }
        if(isUserProfileLoaded){
            return
        }

        var isStatusOK = false;
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json','Access-Control-Allow-Origin':'*' }
        };
        
        fetch('http://localhost:8000/user-detail/'+loggedinUser.id, requestOptions)
            .then((response) => {
                const data = response.json()
                if(response.status === 200){
                    isStatusOK = true
                }  
                return data   
            })
            .then((data) => {
                
                if (isStatusOK){
                    setIsUserProfileLoaded(true)
                    setUserProfile(data.content)
                } 
                
            });
    })

    const handleForm = (e) => {
        if(e.target.name === "postContent"){
            setPostContent(e.target.value)
        }else if(e.target.name === "postImage"){
            if(e.target.files["length"]>0){
                setPostImage(e.target.files[0].name)
            }
        }
    }

    const submitNewPost = (e) =>{
        if(postContent || postImage){
            var isStatusOK = false;
            const newPostData = new FormData(addNewPost.current)

            setPostButton(true)    
            const requestOptions = {
                method: 'POST',
                body: newPostData
            };
            fetch('http://localhost:8000/add-post/'+loggedinUser.id, requestOptions)
                .then((response) => {
                    if(response.status === 200){
                        isStatusOK = true;
                    }
                    return response.json();   
                })
                .then((data) => {
                    if (isStatusOK){
                        setPostError({color:"green",message:data.content});
                        setPostContent("");
                        setPostImage("");
                        addNewPost.current.reset();
                    }else{
                        setPostError({color:"red",message:data.error})
                    }
                    setPostButton(false)  
                }); 
              
        }
        e.preventDefault()
    }

    let newFeed ;
    if(userProfile){
        newFeed  = (
            <Card style={{margin:"5px" }}>
                <Card.Header >
                    <Row>
                        <Col xs={12} md={12} >
                           <h3>Add Post</h3>
                        </Col>
                        <Col xs={12} md={12} >
                            <span style={{color:postError.color}}>{postError.message}</span>
                        </Col>
                    </Row>
                </Card.Header>
                <Card.Body>
                    <Form ref={addNewPost} onSubmit={(e) => submitNewPost(e)}>
                        <Form.Group controlId="newPost.content">
                            <Form.Control as="textarea" name="postContent" value={postContent} rows={3} onChange={(e) => handleForm(e)} />
                        </Form.Group>
                        <Form.Group controlId="newPost.photo">
                            <Form.File id="formcheck-api-custom"  custom >
                                <Form.File.Input name="postImage" isValid onChange={(e) => handleForm(e)} />
                                <Form.File.Label data-browse="Add Photo">
                                    {postImage?postImage:"Browse..."}
                                </Form.File.Label>
                            </Form.File>
                        </Form.Group>
                        <Form.Group controlId="newPost.button">
                            <Button type="submit" block disabled={!(postContent || postImage) || postButton}>{postButton?"Posting...":"Post"}</Button>
                        </Form.Group>
                    </Form>
                </Card.Body>
            </Card>
        )
    }
    return(
        <>
        {isUserProfileLoaded && newFeed?newFeed:<span>Loading...</span>}
        </>
    );

}

export default UserHome;