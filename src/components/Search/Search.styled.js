import styled from 'styled-components';
import { Input, Menu, Button } from 'semantic-ui-react';

export const SearchContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  padding-left: 30px;
  padding-right: 30px;
  margin-top: 30px;

  & .segment.bottom {
    padding: 0px;
    border: none!important;

    & > .segments, .segment {
      border-radius: 0px;
    }
  }
`;

export const StyledSearch = styled(Input)`
  &:before {
    content: none!important;
  }

  flex-grow: 1!important;

  & > input {
    margin-left: -5px;

    &:focus ~ i.icon {
      opacity: 1!important;
    }

    & ~ i.icon {
      opacity: .5!important;
      left: auto!important;
      transition: opacity .3s ease;
    }
  }
`;

export const CreateListingButton = styled(Menu.Item).attrs({
  className: 'item',
  as: Button,
})`
  margin: 0px!important;
  padding-right: 7px!important;
  border-radius: 0px!important;

  &:active, &:focus {
    background-color: inherit!important;
  }

  &:hover {
    background-color: #e8e8e9!important;
  }
`;