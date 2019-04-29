import React from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import { Segment, Table } from 'semantic-ui-react';

export const FlexSegment = styled(Segment)`
  display: flex;
  flex-direction: row;

  &:not(:first-of-type) {
    cursor: pointer;
    &:hover {
      background-color: #fbfbfb;
    }
  }

  &:first-of-type {
    padding-top: 10px;
    padding-bottom: 10px;
  }
`;

export const Header = styled.div.attrs(props => ({
  className: classNames({
    sorted: props.sorted,
    sortable: props.sortable,
    ascending: props.ascending,
    descending: props.descending
  }),
  children: props.name
}))`
  color: #777;
  font-size: 10pt;
  font-weight: 700;
  text-transform: capitalize;
  flex-basis: 50px;
  user-select: none;

  &.sortable {
    cursor: pointer;

    &.sorted {
      &::after {
        font-family: Icons;
        margin-left: 0.5em;
      }

      &.ascending::after {
        content: '\f0d8';
      }

      &.descending::after {
        content: '\f0d7';
      }
    }
  }

  &:not(:first-of-type) {
    margin-left: 22px;
  }
`;

export const StyledTable = styled(Table).attrs({
  compact: true,
  striped: true,
  celled: true,
  selectable: true,
  sortable: true,
  size: 'small',
  unstackable: true,
  singleLine: true,
})`
  &&& {
    border-radius: 0px;
    
    margin-top: 0px;

    && > thead > tr > th {
      border-radius: 0px;
    }

    & tbody > tr {
      cursor: pointer;
    }

    & .listing-condition {
      text-transform: capitalize;
    }
  }
`;

export const Placeholder = styled(Segment).attrs(props => ({
  placeholder: true,
  children: <div>{props.message || ''}</div>
}))`
  min-height: 0px!important;
  height: 50px;
  display: flex;
  font-weight: 700;
  font-size: 14pt;
  align-items: center!important;
`;
