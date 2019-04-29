import styled from 'styled-components';
import { Card } from 'semantic-ui-react';

export const SignInContainer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;

  width: 100%;
  height: 100vh;

  padding-top: 15vh;
  background-color: #f9f9f9;
`;

export const ErrorContainer = styled(Card.Content).attrs({extra: true})`
  && .message {
    padding: 10px 15px;

    & .header + p {
      font-size: 13px;
      margin-top: 5px;
    }
  }
`;

export const ToggleLink = styled.span`
  &:hover {
    color: #1e70bf;
    cursor: pointer;
  }
`;