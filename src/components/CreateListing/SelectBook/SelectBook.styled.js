import styled from 'styled-components';

export const SelectBookContainer = styled.div`
  padding: 2%;
  display: flex;
  flex-direction: column;
  align-items:flex-start;
  justify-content: flex-start;
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
