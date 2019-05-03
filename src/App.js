import React, { Component } from 'react';
import { connect } from 'react-redux';
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom';

import { library } from '@fortawesome/fontawesome-svg-core'
import { faExchangeAlt, faUpload, faPlus} from '@fortawesome/free-solid-svg-icons'
import UserAuthentication from './components/SignIn';
import CreateListing from './components/CreateListing';
import ListingDetails from './components/ListingDetails';
import Search from './components/Search';
import Dashboard from './components/Dashboard';

import Header from './components/Header';

// Stylesheets
import './App.css';
import 'semantic-ui-css/semantic.css';

// Redux
import { loadUserState } from './redux/reducers/userReducer';

library.add(faExchangeAlt);
library.add(faUpload);
library.add(faPlus)

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

export class App extends Component {
  async componentDidMount() {
    await this.props.loadUserState();
  }

  render() {
    const { currentUser } = this.props;

    return currentUser !== undefined ? (
      <Router>
        <Route exact path='/login' component={UserAuthentication}/>
        <Route>
          <div className='pageContainer'>
            <Header />
            <Switch>
              <ProtectedRoute exact path='/dashboard' component={Dashboard} currentUser={currentUser} />
              <ProtectedRoute exact path='/listings' component={Search} currentUser={currentUser} />
              <Route
                exact
                path='/listings/new'
                component={CreateListing}
                currentUser={currentUser}
              />
              <ProtectedRoute path='/listings/:id' component={ListingDetails} currentUser={currentUser} />
            </Switch>
          </div>
        </Route>
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
