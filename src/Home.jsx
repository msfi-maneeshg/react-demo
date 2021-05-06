import React from 'react'
import Login from './Login';
import Registration from './Registration';

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
        }
        return homePage;
    }
}

export default Home