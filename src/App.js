import React, { Component } from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
// import 'semantic-ui-css/semantic.css';
import './App.css';

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
          <h3>Sign_in Component</h3>
          <Switch>
            <Route exact path='/' component={UserAuthentication}/>
          </Switch>
        </div>
        <div>
          <h3>Search Component</h3>
					<Route exact path='/' component={Search}/>
    		</div>
      </Router>
    );
  }
}

export default App;