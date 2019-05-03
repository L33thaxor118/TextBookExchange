import styled from 'styled-components';

export const ModifyListingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding-top: 30px;
  margin: 0px 10% 0px 0%;
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
  }
  .endButtons {
    margin-top: 5%;
  }
`;

export const ImageContainer = styled.div`
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
  .price={
    font-size: 20px;
    font-weight: bold;
  }
`;
