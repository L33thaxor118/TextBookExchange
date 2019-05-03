import React from 'react';
import styled from 'styled-components';

const FieldContainer = styled.div`
  display: flex;
  flex-direction: column;

  & > .filter-label {
    margin-bottom: 3px;
    font-size: 12px;
    color: #555;
    font-weight: bold;
  }
`;

const FilterField = ({ label, children }) => (
  <FieldContainer>  
    <div className='filter-label'>{label}</div>
    {children}
  </FieldContainer>
);

export default FilterField;