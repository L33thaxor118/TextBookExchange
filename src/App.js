import React, { Component } from 'react';
import {BrowserRouter as Router, Route, Switch, Link} from 'react-router-dom'
import UserAuthentication from './Sign_in/Sign_in'
import logo from './logo.svg';
import './App.css';
import 'semantic-ui-css/semantic.css';


class App extends Component {
  render() {
    return (
      <Router>
        <div className="pageContainer">
          <Switch>
            <Route exact path={process.env.PUBLIC_URL + '/'} component={UserAuthentication}/>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
