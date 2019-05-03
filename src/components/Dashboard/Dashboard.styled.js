import styled from 'styled-components';
import React from 'react';

export const AuthorsList = styled.div`
  color: #999;
  font-style: italic;
  padding-bottom:7px;
`;

export const DashboardMenu = styled.div.attrs(props => ({
  children: (
    <div className='inner-link'>
      {props.label}
    </div>
  )
}))`
  padding: 0px 10px;
  color: #444;
  cursor: pointer;
  align-items: center;

  &.active .inner-link {
    border-bottom: 3px solid #444;
  }



  & .inner-link {
    padding-left: 2px;
    padding-right: 2px;
    padding-bottom: 3px;

    &:hover {
      color: #777;
    }
  }
`;