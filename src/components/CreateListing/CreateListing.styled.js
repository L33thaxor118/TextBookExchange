import styled from 'styled-components';

export const CreateListingContainer = styled.div`
  margin-top:5%;
  width: 100%;
  height: 80%;
  overflow: scroll;
  display: flex;
  flex-direction: column;
  align-items: center;

  .uploadComponentContainer {
    display: flex;
    flex-direction: row;
    height: 50vh;
    width: 100%;
    .dragbox {
      height: 100%;
      width: 30%;
    }
    .imagesContainer {
      display: flex;
      flex-direction: row;
      width: 70%;
      height: 100%;
      .previewImage {
        width:45vh;
        height: 100%;
        margin-left: 1vh;
        margin-right: 1vh;
      }
    }
  }

`;

export const CreateListingMainForm = styled.div`
  margin-top: 5%;
  width: 60%;
  display: flex;
  flex-direction: column;
  margin-bottom: 5%;

  & .description {
    width: 100%;
  }
`;

export const Exchange = styled.div`
  display: flex;
  flex-direction: row;
  width: 60%;
  justify-content: center;
  .offer {
    flex-grow:1;
    height: 100%;
    h1 {text-align:center;}
  }

  .tradeFor {
    flex-grow:1
    height: 100%;
    h1 {text-align:center;}
  }

  .icon {
    align-self: center;
    margin-left: 5%;
    margin-right: 5%;
  }
`;
