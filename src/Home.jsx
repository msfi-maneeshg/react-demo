import React from 'react'
import Login from './Login';
import Registration from './Registration';
import UserList from './UserList';
import {UserProfile} from './user/Home';
import { store } from './store/store';
import { Container,Row,Col,ListGroup   } from 'react-bootstrap';

class Home extends React.Component{

    constructor(props){
        super(props);
        this.state = {pageID : ""};
    }

    changePage(id){
        this.setState({pageID:id});
    }

    checkPageID(currentID){
        const pageID =  this.state.pageID.toString();
        if (currentID === pageID){
            return "Disabled";
        }
        return null;
    }
    render(){
        let pageID =  this.state.pageID.toString();
        const isLoggin = store.getState().checkUserLogin.isLogin;
        let headerMenu = (
            <>
                <ListGroup.Item action variant="info"  onClick={() => this.changePage('login')} >Login</ListGroup.Item>
                <ListGroup.Item action variant="info" onClick={() => this.changePage('register')}>Register</ListGroup.Item>  
            </>
        );

        if(isLoggin){
            headerMenu = (
                <>
                    <ListGroup.Item action variant="info"  onClick={() => this.changePage('dashboard')} >Dashboard</ListGroup.Item>
                    <ListGroup.Item action variant="info" onClick={() => this.changePage('list')}>Users List</ListGroup.Item>
                    <ListGroup.Item action variant="info" onClick={() => this.changePage('my-profile')}>My Profile</ListGroup.Item>
                </>
            );
        }else if (pageID != "login"||pageID != "register"){
            pageID = "login"
        }     
        
        let homePage = (
            <Row>
                <Col>
                    <ListGroup horizontal>
                        {headerMenu}
                    </ListGroup>
                </Col> 
            </Row>
        );
        let bodyContainer = <Login/>;


        
        switch(pageID){
            case "register":
                bodyContainer = <Registration />;
                break;
            case "list":
                bodyContainer = <UserList />;
                break;
            case "my-profile":
                bodyContainer = <UserProfile />;
                break;    
            default:
                bodyContainer = <Login/>;
                break;
        }    

        return (
            <Container>
                {homePage}
                <Row>
                    {bodyContainer}
                </Row>
            </Container> 
            );
    }
}

export default Home