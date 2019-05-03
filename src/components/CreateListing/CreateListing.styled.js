import styled from 'styled-components';
import { Form } from 'semantic-ui-react';

export const CreateListingContainer = styled.div`
  padding-top:1%;
  padding-left:5%;
  padding-right: 5%;
  display: flex;
  width: 60%;
  background-color: rgba(66, 134, 244, 0.3);
  align-self: center;
  flex-direction: column;
  align-items: center;

  .background {
    width: 70%;
    padding: 0 5%;
    background-color: rgba(255, 104, 43, 0.9);
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    align-self: center;
  }

  .errorMessage{
    display: flex;
    flex-direction: row;
    padding: 0% 5%;
  }
`;

export const StyledFormSelect = styled(Form.Select)`
  text-transform: capitalize;

  & .text {
    text-transform: capitalize;
  }
`;