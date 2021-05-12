import React from 'react'
import {Container, Table,Row,Col,Image} from 'react-bootstrap';
import {} from './style.css';
class UserList extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            isListLoaded : true,
            userList : []
        }
    }

    componentDidMount(){
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json','Access-Control-Allow-Origin':'*' }
        };
        fetch('http://localhost:8000/user-list', requestOptions)
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
                if (this.state.isStatusOK){
                    this.setState({ userList: data.content,isListLoaded:true })
                } 
            });
    }

    render(){
        let finalOutput;
        let header = (
            <h1>User List</h1>
        ) 
        if (this.state.isListLoaded){
            finalOutput = <UserInfo userList={this.state.userList} />
        }else if(this.state.isStatusOK) {
            finalOutput = (
                <div>
                    <p>Something went wronge.</p>
                </div>
            )
        }else{
            finalOutput = (
                <div>
                    <p>Loading user list...</p>
                </div>
            )
        }
        return (
        <>
            {header}
            {finalOutput}
        </>)
        
    }
}

function UserInfo(props) {
    
    return(<Container>
            {props.userList.map(userInfo => (
                <Row className="user-list-row">
                    <Col className="profile-image" xs={2} md={2} ><Image width="50" src={"http://localhost:8000/image/"+userInfo.profileImage} thumbnail /></Col>
                    <Col className="info" xs={6} md={6} >
                        <span>{userInfo.name}</span>
                        <span>{userInfo.email}</span>
                    </Col>
                    <Col xs={2} md={2}>
                        <a href={"profile/"+userInfo.id} >View</a>
                    </Col>
                </Row>
            ))}
    </Container>);
}

export default UserList