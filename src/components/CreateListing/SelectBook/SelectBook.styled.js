import styled from 'styled-components';

export const SelectBookContainer = styled.div`
  opacity: ${props => props.disabled ? 0.5 : 1};
  display: flex;
  position: relative;
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: 80%;
  h1 {
    align-self: center;
    margin-left: 3%;
    margin-right: 3%;
  }
`;


export const SelectBookRadioGroup = styled.div`
  padding: 2%;
  width: 100%;
  height: 100%;
  border-radius:10px;
  display: flex;
  flex-direction: column;
  margin-right: 3%;
  margin-left: 3%;
  background-color: ${props => props.selected ? "#4286f4" : "white"};
  .radio {
    display: flex;
    align-self: center;
  }
  h3 {
    opacity: ${props => props.selected ? 1 : 0.5};
    text-align: center;
    margin-bottom: 10px;
  }
  .input {
    margin-top:12%;
    position: relative;
  }
`;
