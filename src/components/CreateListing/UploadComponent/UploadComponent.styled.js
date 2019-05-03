import styled from 'styled-components';

export const UploadComponentContainer = styled.div`
  position: relative;
  border-style: dashed;
  border-radius: 10px;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  .idle {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .dragging {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background-color: blue;
    opacity: 0.3;
  }

`;
