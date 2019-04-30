/** 
@author Srilakshmi Prasad
**/
import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Flex } from '@rebass/grid';

import { MenuLink } from './Header.styled';

import { signOut } from '../../redux/reducers/userReducer';

import logo from './logo.png';
import './Header.scss';

const Header = ({ location = {}, history, ...props }) => {
  const [activeButton, setActiveButton] = useState();

  const navButtons = [
    {label: 'Search Listings', pathname: '/listings'},
    {label: 'Create a Listing', pathname: '/listings/new'},
    {label: 'Dashboard', pathname: '/dashboard'},
  ];

  const routeToPath = pathname => {
    setActiveButton(pathname);
    history.push(pathname);
  };

  useEffect(() => setActiveButton(location.pathname), [location.pathname]);

  return (
    <div id="navbar">
      <img
        id='logo'
        src={logo}
        alt='site logo'
        onClick={() => routeToPath('/')}
      />
      <Flex>
        {navButtons.map(({ label, pathname }) => (
          <MenuLink
            key={label}
            className={activeButton === pathname ? 'active' : 'inactive'}
            onClick={() => routeToPath(pathname)}
            label={label}
          />
        ))}
        <MenuLink label='Sign out' onClick={props.signOut} />
      </Flex>
    </div>
  );
};


export default withRouter(connect(
  undefined,
  dispatch => ({ signOut: () => dispatch(signOut()) })
)(Header));