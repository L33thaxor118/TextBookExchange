import React, { Component } from 'react';
import { connect } from 'react-redux';
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom';

import { library } from '@fortawesome/fontawesome-svg-core'
import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons'
import UserAuthentication from './components/SignIn';
import CreateListing from './components/CreateListing';
import ListingDetails from './components/ListingDetails';
import Search from './components/Search';

import Header from './components/Header';

// Stylesheets
import './App.css';
import 'semantic-ui-css/semantic.css';

// Redux
import { loadUserState } from './redux/reducers/userReducer';

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
  async componentDidMount() {
    await this.props.loadUserState();
  }

  render() {
    const { currentUser } = this.props;

    return currentUser ? (
      <Router>
        <Switch>
          <Route exact path='/login' component={UserAuthentication}/>
          <div className='pageContainer'>
            <Header />
            <ProtectedRoute exact path='/listings' component={Search} currentUser={currentUser} />
            <ProtectedRoute
              exact
              path='/listings/new'
              component={CreateListing}
              currentUser={currentUser}
            />
            <ProtectedRoute path='/listings/:id' component={ListingDetails} currentUser={currentUser} />
          </div>
        </Switch>
      </Router>
    ) : null;
  }
}

export default connect(
  state => ({ currentUser: state.loginState.user }),
  dispatch => ({
    loadUserState: () => dispatch(loadUserState()),
  })
)(App);