import React from 'react';
import styled from 'styled-components';
import { MenuButton } from '../Search.styled';

export const FilterTrigger = styled(({ hasFilter, ...props }) => (
  <MenuButton {...props} />
))`
  padding-right: 15px!important;
  ${props => props.hasFilter ? 'color: #5252da!important;' : ''}
`;

export const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 400px;
  min-height: 100px;

  & .rc-slider {
    width: calc(100% - 22px);
    left: 6px;
    margin-bottom: 25px;
  }

  & input[type='checkbox'] + label {
    user-select: none;
  }
`;

export const HandleLabel = styled.div.attrs(props => ({
  children: props.value !== 200 ? `$${props.value}` : `$${props.value}+`
}))`
  position: absolute;
  left: ${({ value }) => {
    if (value >= 0 && value <= 9) {
      return '-3px';
    } else if (value >= 10 && value <= 99) {
      return '-6px';
    } else {
      return '-9px';
    }
  }}
  top: 10px;
  user-select: none;

  font-size: 11px;
  color: #666;
`;

export const ConditionContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  max-width: 300px;
`;

export const ConditionControl = styled.div`
  & label {
    margin-left: 3px;
    font-size: 11px;
  }
`;