import React, { Component } from 'react';
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom';

import { library } from '@fortawesome/fontawesome-svg-core'
import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons'
import UserAuthentication from './SignIn';
import CreateListing from './CreateListing';
import ListingDetails from './ListingDetails';
import Search from './Search';

// Stylesheets
import './App.css';
import 'semantic-ui-css/semantic.css';
import { authentication } from './utils/firebase';

library.add(faExchangeAlt);

//Source for ProtectedRoute:
//https://medium.com/@leonardobrunolima/react-tips-how-to-protect-routes-for-unauthorized-access-with-react-router-v4-73c0d451e0a2
const ProtectedRoute = ({ component: Component, currentUser, ...rest }) => (
  <>
    {currentUser !== undefined ? (
      <Route {...rest} render={props => (
        currentUser !== null ?
          <Component {...props} /> : (
            <Redirect
              to={{
                pathname: '/login',
                state: {
                  from: props.location.pathname
                }
              }}
            />
          )
        )}
      />
    ) : null}
  </>
);

class App extends Component {
  state = {};

  async componentDidMount() {
    // TODO: move this to Redux
    authentication.onAuthStateChanged(user => this.setState({ user }))
  }

  render() {
    return (
      <Router>
        <div className='pageContainer'>
          <Switch>
            <Route exact path='/login' component={UserAuthentication}/>
            <ProtectedRoute exact path='/listings' component={Search} currentUser={this.state.user} />
            <ProtectedRoute
              exact
              path='/listings/new'
              component={CreateListing}
              currentUser={this.state.user}
            />
            <ProtectedRoute path='/listings/:id' component={ListingDetails} currentUser={this.state.user} />
          </Switch>
        </div>
      </Router>
    );
  }
}


export default App;
