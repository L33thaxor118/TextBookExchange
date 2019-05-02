import styled from 'styled-components';

export const CreateListingContainer = styled.div`
  margin-top:0%;
  display: flex;
  flex-direction: column;
  align-items: center;
  .background{
    position: absolute;
    z-index: -1;
    height: 100%;
    width: 80%;
    background-color: blue;
    opacity: 0.2;
  }

  .uploadComponentContainer {
    display: flex;
    flex-direction: row;
    height: 30vh;
    .dragbox {
      display: flex;
      width: 20%;
    }
    .imagesContainer {
      display: flex;
      flex-direction: row;
      width: 100%;
      .previewImage {
        height: 100%;
        width: 20%;
        margin-left: 1vh;
        margin-right: 1vh;
      }
    }
  }
  .errorMessage{
    display: flex;
    flex-direction: row;
  }

`;

export const CreateListingMainForm = styled.div`
  width: 80%;
  overflow: hidden;
  margin-top: 2%;
  display: flex;
  flex-direction: column;
  margin-bottom: 5%;

  & .description {
    width: 100%;
    height: 25vh;
  }
`;

export const Exchange = styled.div`
  flex-wrap: wrap;
  overflow: show;
  width: 80%;
  margin-top: 3%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  .offer {
    display: flex;
    flex-direction: column;
    flex-grow:1;
    h1 {text-align:center;}
  }

  .tradeFor {
    display: flex;
    flex-direction: column;
    flex-grow:1;
    h1 {text-align:center;}
  }

  .icon {
    align-self: center;
    margin-left: 5%;
    margin-right: 5%;
  }
`;
