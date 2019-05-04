import styled from 'styled-components';
import { Search } from 'semantic-ui-react';

export const SelectBookContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;

  margin-bottom: 10px;

  & .field {
    margin-bottom: 0px!important;
  }
`;

export const SelectBookRadioGroup = styled.div`
  width: 40%;
  display: flex;
  flex-direction: column;

  .radioSelection {
    font-size: 20px;
    display: flex;
    flex-direction: row;
    align-items: baseline;
  }

  .inputBox {
    display: flex;
    flex-direction: row;
    height: 7vh;
  }

  .inputContainer {
    margin-left: 5%;
    width: 80%;
  }

  .errorMessage {
    width: 80%;
    display: flex;
    justify-content: stretch;
    align-items:top;
    margin-top: 1%;
  }
`;

export const RadioField = styled.div`
  padding-bottom: 4px;

  & > .field {
    margin-bottom: ${props => props.active ? '10px' : '4px'}!important;
  }
`;

export const BookOption = styled.div`
  & div[name="authors"] {
    font-size: 12px;
    color: #888;

    &:before {
      content: 'by ';
    }
  }

  & div[name="title"] {
    text-transform: capitalize;
    font-size: 14px;
  }
`;

export const StyledSearch = styled(Search)`
  & input {
    width: 300px!important;
    border-radius: 0.28571429rem!important;
  }

  margin-bottom: 5px;
`;

export const Header = styled.div`
  font-size: 15px;
  font-weight: bold;
  margin-bottom: 7px;
`;
