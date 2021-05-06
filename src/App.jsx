import React from 'react'
import logo from './logo.svg';
import './App.css';

function GetWelcomeMessage(user){
  let message = <>Hello Unknown!</>
  if (user){
    message = <>Hello {user.userInfo.fName } {user.userInfo.lName}!</>
  }
return (<>
  <p>{message}</p>
 </>);
}

function App(props) {
  const increment = 3;
  const displayData = (<div className="App">
  <header className="App-header">
    <img src={logo} className="App-logo" alt="logo" />
    <GetWelcomeMessage  userInfo={props.user}  />
    <GetWelcomeMessage userInfo={props.user}  />
   <Clock inc={increment} />
  </header>
</div>);

  return (
    <>{displayData}</>
  );
  
}

class Clock extends React.Component{
  
  constructor(props) {
    super(props);
    this.state = {counter: 0,isToggle:true};
    // this.clickAction = this.clickAction.bind(this);
    // this.props = props.data
  }
  updateDate(){
    // this.setState({counter: this.state.counter + this.props.inc});
    this.setState((state, props) => ({
      counter: state.counter + props.inc
    }));
  }
  componentDidMount(){
    // this.dateID = setInterval(() => this.updateDate(),100);
  }

  componentWillUnmount(){
    //clearInterval(this.dateID);
  }

  clickAction(id) {
    this.setState((state,props)=>({
      counter:state.counter + id
    }));
  }

  render(){
    return(
      <>
      <div>Counter : {this.state.counter}</div>
    <a href="#" onClick={() => this.clickAction(1)}>Add 1</a>
    <a href="#" onClick={ () => this.clickAction(2)}>Add 2</a>
      </>
    );
  }
}


export default App;
