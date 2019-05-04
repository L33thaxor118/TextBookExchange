import styled from 'styled-components';

export const ModifyListingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding-top: 30px;
  margin: 0px 10% 0px 0%;
  opacity: ${props => props.completed ? 0.1 : 1};
  pointer-events: ${props => props.completed ? 'none' : 'auto'};
  .bookTitle {
    font-size: 20px;
    font-weight: bold;
  }
  .authorsList {
    color: #999;
    font-style: italic;
  }
  .background {
    width: 70%;
    padding: 30px 5% 1% 5%;
    background-color: rgba(66, 134, 244, 0.3);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 30px;
    .condition {
      text-transform: capitalize;
      & .text {
        text-transform: capitalize;
      }
    }
    .endButtons {
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      width: 80%;
      margin: 5% 0 3% 0;
      .b1{
        width: 30%;
        display: flex;
      }
      .b2{
        width: 30%;
        display: flex;
      }
      .b3{
        width: 30%;
        display: flex;
      }
    }
  }
`;

export const MessageCompleted = styled.div`
  width: 30%;
  display: flex;
  align-self: center;
  margin-top: 10%;
`;
export const MessageDeleted = styled.div`
  width: 30%;
  display: flex;
  align-self: center;
  margin-top: 10%;
`;

export const PhotosContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: 25vh;
  width: 100%;
`;
export const ExchangeHeader = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-around;
  align-items: center;
  padding: 2% 0 2% 0;
  .price={
    margin-left: 10px;
    font-size: 25px;
    font-weight: bold;
  }
`;
