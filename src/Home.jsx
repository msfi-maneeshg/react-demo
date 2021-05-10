import React from 'react'
import Login from './Login';
import Registration from './Registration';
import UserList from './UserList';
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
        let headerMenu = (<>
                    <ListGroup.Item action variant="info"  onClick={() => this.changePage('login')} >Login</ListGroup.Item>
                    <ListGroup.Item action variant="info" onClick={() => this.changePage('register')}>Register</ListGroup.Item>  
                    <ListGroup.Item action variant="info" onClick={() => this.changePage('list')}>UserList</ListGroup.Item>
                    </>);
        if(this.state.pageID.toString() === "login"){
            headerMenu = (<>
                <ListGroup.Item action variant="info"  onClick={() => this.changePage('home')}>Home</ListGroup.Item>
                <ListGroup.Item action variant="info" onClick={() => this.changePage('register')}>Register</ListGroup.Item>  
                <ListGroup.Item action variant="info" onClick={() => this.changePage('list')}>UserList</ListGroup.Item>
                </>);
        }else if(this.state.pageID.toString() === "list"){
            headerMenu = (<>
                <ListGroup.Item action variant="info"  onClick={() => this.changePage('home')}>Home</ListGroup.Item>
                <ListGroup.Item action variant="info"  onClick={() => this.changePage('login')}>Login</ListGroup.Item>
                <ListGroup.Item action variant="info" onClick={() => this.changePage('register')}>Register</ListGroup.Item>  
                </>);
        }else if(this.state.pageID.toString() === "register"){
            headerMenu = (<>
                <ListGroup.Item action variant="info"  onClick={() => this.changePage('home')}>Home</ListGroup.Item>
                <ListGroup.Item action variant="info"  onClick={() => this.changePage('login')}>Login</ListGroup.Item>
                <ListGroup.Item action variant="info" onClick={() => this.changePage('list')}>UserList</ListGroup.Item>
                </>);
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
        let bodyContainer = (
            <div>
                <h1>Home Page</h1>
            </div>
        );
        
        if (this.state.pageID.toString() === "login"){
            bodyContainer = <Login onClick={() => this.changePage('home')}/>;
        }else if (this.state.pageID.toString() === "register"){
            bodyContainer = <Registration />;
        }else if (this.state.pageID.toString() === "list"){
            bodyContainer = <UserList />;
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