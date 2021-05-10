import React from 'react'
import {Form,Button,Alert,Table,Container,Row,Col} from 'react-bootstrap';
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
            finalOutput = (
                <div>
                    <Table bordered hover>
                        <thead>
                            <tr>
                                <th>Full Name</th>
                                <th>Email Address</th>
                                <th>Phone Number</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.userList.map(userInfo => (
                                <tr key={userInfo.id}>
                                    <td>{userInfo.name}</td>
                                    <td>{userInfo.email}</td>
                                    <td>{userInfo.phone}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            )
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

export default UserList