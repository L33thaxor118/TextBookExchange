import styled from 'styled-components';

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
    align-items: center;
    align-self: center;
  }
  .errorMessage{
    display: flex;
    flex-direction: row;
    padding: 0% 5%;
  }

  .offer {
    width: 100%;
  }

  .offerForm {
    width: 60%;

  }
  .createListingDescription{
    width: 100%;
    margin: 2% 0;
  }
  .tradeFor {
    width: 100%;

  }

`;
