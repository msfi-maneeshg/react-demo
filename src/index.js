import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Home from './Home';
// import reportWebVitals from './reportWebVitals';
function getWelcomeMessage(){
  // const user = {fName:"Maneesh",lName:"Goyal"}
  ReactDOM.render(
      <Home user={{fName:"Maneesh",lName:"Goyal"}}/>,
    document.getElementById('root')
  );
}
getWelcomeMessage();


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
