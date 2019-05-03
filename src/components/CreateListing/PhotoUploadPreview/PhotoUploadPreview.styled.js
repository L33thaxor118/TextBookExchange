import styled from 'styled-components';

export const PhotoUploadPreviewContainer = styled.div`
  position: relative;
  width: 10%;
  height: 100%;
  margin: 0 5px 0 5px;

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
