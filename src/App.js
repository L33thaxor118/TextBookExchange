import React, { Component } from 'react';
import {BrowserRouter as Router, Route, Switch, Link, Redirect} from 'react-router-dom';
import UserAuthentication from './Sign_in/Sign_in';
import CreateListing from './CreateListing/CreateListing';
import logo from './logo.svg';
import './App.css';
import 'semantic-ui-css/semantic.css';
import { authentication } from './Utils/Firebase/firebase';

//Source for ProtectedRoute:
//https://medium.com/@leonardobrunolima/react-tips-how-to-protect-routes-for-unauthorized-access-with-react-router-v4-73c0d451e0a2
const ProtectedRoute = ({ component: Component, ...rest }) => (
   <Route {...rest} render={(props) => (
      authentication.currentUser != null ?
         <Component {...props} /> : <Redirect to={{ pathname: process.env.PUBLIC_URL + '/', state: { from: props.location }}} />
   )} />
);

// Include new Components here
// import Home from './Home/Home'
import Search from './Search';
import UserAuthentication from './Sign_in';

// Currently displays Sign_in and Search components for testing purposes
class App extends Component {
  render() {
    return (
      <Router>
        <div className="pageContainer">
          <Switch>
            <Route exact path={process.env.PUBLIC_URL + '/'} component={UserAuthentication}/>
            <ProtectedRoute exact path={process.env.PUBLIC_URL + '/CreateListing'} component={CreateListing}/>
          </Switch>
        </div>
      </Router>
    );
  }
}


export default App;
