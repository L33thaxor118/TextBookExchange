import styled from 'styled-components';

export const PhotoUploadPreviewContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;

  h1, img {
    position: absolute;
    right: 0;
  }

  h1 {
    margin-right: 1%;
    margin-top: 1%;
  }

  h1:hover {
    color: white;
    cursor: pointer;
  }

  img {
    width: 100%;
    height: 100%;
  }
`;
