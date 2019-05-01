import styled from 'styled-components';

export const CreateListingContainer = styled.div`
  width: 100%;
  height: 80%;
  overflow: scroll;
  display: flex;
  flex-direction: column;
  align-items: center;

  .uploadComponentContainer {
    display: flex;
    flex-direction: row;
    width: 300px;
    height: 300px;
  }

  .mainForm {
    border-style:dashed;
    width: 60%;
    display: flex;
    flex-direction: column;
    margin-bottom: 5%;

    & .description {
      width: 100%;
    }
  }

`;

export const Exchange = styled.div`
  display: flex;
  flex-direction: row;
  width: 80%;
  flex-wrap: wrap;
  justify-content: center;
  border-style: dashed;
  .offer {
    h1 {text-align:center;}
  }

  .tradeFor {
    h1 {text-align:center;}
  }

  .icon {
    align-self: center;
    margin-left: 5%;
    margin-right: 5%;
  }
`;
