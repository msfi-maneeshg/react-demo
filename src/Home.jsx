import React from 'react'
import Login from './Login';
import Registration from './Registration';
import UserList from './UserList';
import {UserHome,UserProfile} from './user/Home';
import { store } from './store/store';
import { Container,Row,Col,ListGroup   } from 'react-bootstrap';
import {  Switch,Route,useHistory } from 'react-router-dom'
function Home (){
    let history = useHistory();
    const isLoggin = store.getState().checkUserLogin.isLogin;
    
    const changePage = (pagePath) => {
        history.push("/"+pagePath);
    }

    let headerMenu = (
        <>
            <ListGroup.Item action variant="info" onClick={() => changePage("login")}>Login</ListGroup.Item>
            <ListGroup.Item action variant="info" onClick={() => changePage("register")}>Register</ListGroup.Item>  
        </>
    );

   

    if(isLoggin){
        headerMenu = (
            <>
                <ListGroup.Item action variant="info" onClick={() => changePage("dashboard")}>Dashboard</ListGroup.Item>
                <ListGroup.Item action variant="info" onClick={() => changePage("user-list")}>Users List</ListGroup.Item>
                <ListGroup.Item action variant="info" onClick={() => changePage("my-profile")}>My Profile</ListGroup.Item>
            </>
        );
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
          

    return (
        <Container>
            {homePage}
            <Row>
                <Switch>
                    <Route exact path="/" component={Login}/>
                    <Route exact path="/login" component={Login}/>
                    <Route path="/register" component={Registration}/>
                    <Route path="/user-list" component={isLoggin?UserList:Login}/>
                    <Route path="/dashboard" component={isLoggin?UserHome:Login}/>
                    <Route path="/my-profile" component={isLoggin?UserProfile:Login}/>
                    <Route path="/profile/:id" component={isLoggin?UserProfile:Login}/>
                    <Route component={NotFound} />
                </Switch>
            </Row>
        </Container> 
        );
    
}

function NotFound(){
    return(
        <div>Oops! Page not found 404!</div>
    );
}
export default Home