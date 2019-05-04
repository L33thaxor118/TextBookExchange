import styled from 'styled-components';
import { Form } from 'semantic-ui-react';

export const CreateListingContainer = styled.div`
  padding-top: 50px;

  display: flex;
  width: 100%;
  height: 100vh;

  background-color: rgba(0, 32, 88, 0.8);
  align-self: center;
  flex-direction: column;
  align-items: center;
  h1 {
    color: white;
    margin-bottom: 5%:
  }

  .background {
    width: 700px;
    padding: 30px 30px;
    background-color: rgba(233,74,55, 0.9);
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

  & textarea {
    resize: none!important;
  }
`;

export const StyledFormSelect = styled(Form.Select)`
  text-transform: capitalize;

  & .text {
    text-transform: capitalize;
  }
`;

export const UploadTrigger = styled.div`
  &&& button {
    ${props => props.active ? `
      background-color: #00b5ad;
      &:hover {
        background-color: #009c95;
      }
    ` : `
      background-color: white;
      &:hover {
        background-color: #eee;
      }
    `}
  }
`;

export const CheckboxField = styled.div`
  padding-bottom: 4px;

  & > .field {
    margin-bottom: ${props => props.active ? '10px' : '4px'}!important;
  }
`;
