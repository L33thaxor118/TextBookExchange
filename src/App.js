import React, { Component } from 'react';
import { connect } from 'react-redux';
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom';

import { Loader } from 'semantic-ui-react';
import { Flex } from '@rebass/grid';

import { library } from '@fortawesome/fontawesome-svg-core'
import { faExchangeAlt, faUpload, faPlus} from '@fortawesome/free-solid-svg-icons'
import UserAuthentication from './components/SignIn';
import CreateListing from './components/CreateListing';
import ListingDetails from './components/ListingDetails';
import ModifyListing from './components/ModifyListing';
import Search from './components/Search';
import Dashboard from './components/Dashboard';
import Home from './components/Home';
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
const ProtectedRoute = ({ component: Component, currentUser, children, ...rest }) => (
  <>
    {currentUser !== undefined ? (
      <Route {...rest} render={props => (
        currentUser !== null
          ? (Component ? <Component {...props} /> : <>{children}</>)
          : <Redirect
              to={{
                pathname: '/login',
                state: {
                  from: props.location.pathname
                }
              }}
            />
        )}
      />
    ) : null}
  </>
);

export class App extends Component {
  state = {
    listingId: null,
  };

  async componentDidMount() {
    await this.props.loadUserState();
  }

  render() {
    const { currentUser, isLoginStateResolved } = this.props;

    return isLoginStateResolved ? (
      <Router>
        <Switch>
          <Route exact path='/login' component={UserAuthentication}/>
          <ProtectedRoute path='/:path*' currentUser={currentUser}>
            <div className='pageContainer'>
              <Header />
              <Switch>
                <Route exact path='/' component={Home} currentUser={currentUser} />
                <Route exact path='/dashboard' component={Dashboard} currentUser={currentUser} />
                <Route exact path='/listings' component={Search} currentUser={currentUser} />
                <Route
                  exact
                  path='/listings/new'
                  component={CreateListing}
                  currentUser={currentUser}
                />
                <Route path='/listings/modify/:id' component={ModifyListing} currentUser={currentUser} />
                <Route path='/listings/:id' component={ListingDetails} currentUser={currentUser} />
              </Switch>
            </div>
          </ProtectedRoute>
        </Switch>
      </Router>
    ) : (
      <Flex alignItems='center' style={{height: '100vh'}}>
        <Loader active inline='centered' content='Loading' />
      </Flex>
    );
  }
}

export default connect(
  state => ({
    currentUser: state.loginState.user,
    isLoginStateResolved: state.loginState.isLoginStateResolved,
  }),
  dispatch => ({
    loadUserState: () => dispatch(loadUserState()),
  })
)(App);
