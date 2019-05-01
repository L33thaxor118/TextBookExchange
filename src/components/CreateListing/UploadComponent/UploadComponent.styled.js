import styled from 'styled-components';

export const UploadComponentContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  border-style: dashed;

  .overlay_visible {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: grey;
    opacity: 0.2;
  }

  .overlay_hidden {
    position: absolute;
    visibility: hidden;
    width: 100%;
    height: 100%;
  }
`;
