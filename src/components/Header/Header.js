/** 
@author Srilakshmi Prasad
**/
import React, { Component } from 'react'

import logo from './logo.png';
import './Header.scss';

class Header extends Component {
  constructor(){
    super();

    this.state = {
      btn_1_active: false,
      btn_2_active: false,
      btn_3_active: false
    }
  }

  //Problem with color changing of buttons
  changeColor(btn, event) {
    if(btn=="b1"){
      console.log("Changing state of b1");
      this.setState({btn_1_active: true,  
                     btn_2_active: false,
                     btn_3_active: false});
    }
    if(btn=="b2"){
      console.log("Changing state of b2");
      this.setState({btn_1_active: false,  
                     btn_2_active: true,
                     btn_3_active: false});
    }
    if(btn=="b3"){
      console.log("Changing state of b3");
      this.setState({btn_1_active: false,  
                     btn_2_active: false,
                     btn_3_active: true});
    }
  }

  render () {
    let btn_1 = this.state.btn_1_active ? "active" : "inactive";
    let btn_2 = this.state.btn_2_active ? "active" : "inactive";
    let btn_3 = this.state.btn_3_active ? "active" : "inactive";

    return (
      <div id="navbar">
        <a href="/" alt-text="Home"><img id="logo" src={logo} alt="Logo" /></a>
        <div id="navbar-right">
          <button className={btn_1} onClick={(e) => this.changeColor("b1", e)}>
            <a href="/listings">Search Listings</a>
          </button>
          <button className={btn_2} onClick={(e) => this.changeColor("b2", e)}>
            <a href="/listings/new">Create Listing</a>
          </button>
          <button className={btn_3} onClick={(e) => this.changeColor("b3", e)}>
            <a href="/dashboard">User Dashboard</a>
          </button>
        </div>
      </div>
    );
  }
}

export default Header;