/** 
@author Srilakshmi Prasad
**/
import React, { Component } from 'react'

class Search extends Component {
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

    // Add any functions & handlers here

    // Currently displays placeholder, will be continued
    render() {
        return (
            <div>Search Placeholder</div>        
        );
    }
}

export default Search