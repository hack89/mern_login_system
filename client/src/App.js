import React, { Component, Fragment } from 'react'
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom'; 
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";
import Navbar from './components/layout/Navbar'
import Landing from './components/layout/Landing'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import PrivateRoute from "./components/private-route/PrivateRoute";
import Dashboard from "./components/dashboard/Dashboard";
import store from './store';
import { decode } from 'jsonwebtoken';

if(localStorage.jwtToken){
  const token = localStorage.jwtToken;
  setAuthToken(token)
  const decoded = jwt_decode(token)
  store.dispatch(setCurrentUser(decoded))

  const currentTime = Date.now() / 1000;
  if(decode.exp < currentTime){
    store.dispatch(logoutUser())
    window.location.href = './login'
  }
}

export default class App extends Component {

  render() {
    return (
      <Router>
        <Fragment>
          <Navbar />
          <Route exact path="/" component={Landing} />
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <PrivateRoute exact path="/dashboard" component={Dashboard} />
          </Switch>
        </Fragment>
      </Router>    
    )
  }
}
