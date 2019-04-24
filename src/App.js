import React, { Component } from 'react';
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom';
import UserAuthentication from './Sign_in/Sign_in';
import CreateListing from './CreateListing/CreateListing';
import './App.css';
import 'semantic-ui-css/semantic.css';
import { authentication } from './Utils/Firebase/firebase';

//Source for ProtectedRoute:
//https://medium.com/@leonardobrunolima/react-tips-how-to-protect-routes-for-unauthorized-access-with-react-router-v4-73c0d451e0a2
const ProtectedRoute = ({ component: Component, ...rest }) => (
   <Route {...rest} render={props => (
      authentication.currentUser != null ?
        <Component {...props} /> : (
          <Redirect
            to={{
              pathname: '/',
              state: {
                from: props.location
              }
            }}
          />
        )
   )} />
);

// Currently displays Sign_in and Search components for testing purposes
class App extends Component {
  render() {
    return (
      <Router>
        <div className="pageContainer">
          <Switch>
            <Route exact path='/' component={UserAuthentication}/>
            <ProtectedRoute exact path='/listings/new' component={CreateListing}/>
          </Switch>
        </div>
      </Router>
    );
  }
}


export default App;
