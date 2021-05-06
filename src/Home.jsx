import React from 'react'
import Login from './Login';
import Registration from './Registration';
import UserList from './UserList';

class Home extends React.Component{

    constructor(props){
        super(props);
        this.state = {pageID : ""};
    }

    changePage(id){
        this.setState({pageID:id});
    }

    render(){
        let homePage = (
            <>
                <button onClick={() => this.changePage('login')}>Login</button>
                <button onClick={() => this.changePage('register')}>Register</button>
                <button onClick={() => this.changePage('list')}>UserList</button>
            </>
        );
        let header = (
            <button onClick={() => this.changePage('home')}>Home</button>
        );
        if (this.state.pageID.toString() === "login"){
            return (
                <>
                    {header}
                    <Login />
                </>
            );
        }else if (this.state.pageID.toString() === "register"){
            return (
                <>
                    {header}
                    <Registration />
                </>
            );
        }else if (this.state.pageID.toString() === "list"){
            return (
                <>
                    {header}
                    <UserList />
                </>
            );
        }
        return homePage;
    }
}

export default Home