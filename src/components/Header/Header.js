/** 
@author Srilakshmi Prasad
**/
import React, { Component } from 'react'

import logo from './logo.png';
import './Header.scss';

class Header extends Component {
  state = {
    active_button: true
  };

  changeColor() {
    this.setState({
      active_button: !this.state.active_button
    });
  }

  render () {
    let btn_class = this.state.active_button ? "inactive" : "active";
    return (
      <div id="navbar">
        <img id="logo" src={logo} alt="Logo" />
        <div id="navbar-right">
          <a className={btn_class} onClick={this.changeColor.bind(this)} href="/">
            Home
          </a>
          <a className={btn_class} onClick={this.changeColor.bind(this)} href="/listings">
            Search Listings
          </a>
          <a className={btn_class} onClick={this.changeColor.bind(this)} href="/dashboard">
            User Dashboard
          </a>
        </div>
      </div>
    );
  }
}

export default Header;