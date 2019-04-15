/** 
@author Srilakshmi Prasad
**/
import React, { Component } from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import logo from './logo.svg';
import './App.css';

// Include new Components here
import Home from './Home/Home.js'
import Search from './Search/Search.js';
import Sign_in from './Sign_in/Sign_in.js';

// Include any new stylesheets here
// Note that components' stylesheets should NOT be included here.
// They should be 'require'd in their component class file.
require('./App.css');

class App extends Component {
  // Add to this as needed
  constructor(props){
		super(props);
  	this.loginHandler = this.loginHandler.bind(this);
	}
	
	// Meant to help pass user info to authorized components
	loginHandler(userInfo){
    this.setState({
      userInfo:userInfo
    })
  }
	
	// Add components you want to test
  render() {
    return (
			<Router>
				<div>
					<Route exact path="/" component={Search}  />
    		</div>
			</Router>
      
    );
  }
}

export default App;
