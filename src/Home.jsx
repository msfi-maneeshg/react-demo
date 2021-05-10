import React from 'react'
import Login from './Login';
import Registration from './Registration';
import UserList from './UserList';
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

    render(){
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
        let bodyContainer;
        
        switch(this.state.pageID.toString()){
            case "register":
                bodyContainer = <Registration />;
                break;
            case "list":
                bodyContainer = <UserList />;
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