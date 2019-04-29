import styled from 'styled-components';

export const ListingContainer = styled.div`
  width: 100%;
  padding-top: 30px;
  margin: 0px 10% 0px 20%;
`;

export const ImageContainer = styled.div`
`;

export const BookTitle = styled.div`
  font-size: 20px;
  font-weight: bold;
`;

export const AuthorsList = styled.div`
  color: #999;
  font-style: italic;

  ${BookTitle} + & {
    margin-top: 5px;
  }
`;