import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Home from './Home';
import 'bootstrap/dist/css/bootstrap.min.css';
import { store } from './store/store';
import { Provider } from 'react-redux';
import {  BrowserRouter } from 'react-router-dom'
store.subscribe(getWelcomeMessage);
function getWelcomeMessage(){
  ReactDOM.render(
      <Provider store={store}>
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      </Provider>,
    document.getElementById('root')
  );
}
getWelcomeMessage();


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
