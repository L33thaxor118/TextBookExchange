import React, { useState } from 'react';
import { Popup, Icon, Button } from 'semantic-ui-react';
import { Range, Handle } from 'rc-slider';
import { Flex } from '@rebass/grid';
import isEqual from 'lodash/isEqual';

import 'rc-slider/assets/index.css';

import FilterField from './FilterField';

import {
  FilterTrigger,
  OptionsContainer,
  HandleLabel,
  ConditionControl,
  ConditionContainer,
} from './FilterPopup.styled';

const conditions = ['New', 'Like new', 'Used - Very Good', 'Used - Good', 'Used - Acceptable'];
const defaultOptions = {
  priceRange: [0, 200],
  conditions: new Set(conditions.map(c => c.toLowerCase())),
};

const RangeHandle = ({ value, ...restProps }) => {
  delete restProps.dragging;
  return (
    <React.Fragment key={restProps.index}>
      <div
        className={restProps.className}
        style={{left: (value/2)+'%'}}
      >
        <HandleLabel value={value} />
      </div>
      <Handle {...restProps} />
    </React.Fragment>
  );
};

const FilterView = ({ currentOptions, onApplyFilter }) => {
  const [filterOptions, setFilterOptions] = useState({
    ...(currentOptions || defaultOptions),
    max: 200,
  });

  const handleConditionChange = condition => event => {
    const nextConditions = new Set(filterOptions.conditions);
    if (event.target.checked) {
      nextConditions.add(condition);
    } else {
      nextConditions.delete(condition);
    }

    setFilterOptions({
      ...filterOptions,
      conditions: nextConditions,
    });
  };

  const handleRangeChange = range => setFilterOptions({
    ...filterOptions,
    priceRange: range,
  });

  const handleApplyFilter = () => onApplyFilter({
    ...filterOptions,
    isDefaultFilter: isEqual(filterOptions, defaultOptions),
  });

  const resetFilter = () => setFilterOptions(defaultOptions);

  return (
    <OptionsContainer>
      <h3>Filter search results</h3>
      <FilterField label='By price'>
        <Range
          min={0}
          max={200}
          value={filterOptions.priceRange}
          allowCross={false}
          handle={RangeHandle}
          marks={{0: '', 200: ''}}
          onChange={handleRangeChange}
        />
      </FilterField>
      <FilterField label='By condition'>
        <ConditionContainer>
          {conditions.map(condition => (
            <ConditionControl key={condition}>
              <input key={condition}
                id={`filter-comp-${condition}`}
                type='checkbox'
                checked={filterOptions.conditions.has(condition.toLowerCase())}
                onChange={handleConditionChange(condition.toLowerCase())}
              />
              <label htmlFor={`filter-comp-${condition}`}>
                {condition}
              </label>
            </ConditionControl>
          ))}
        </ConditionContainer>
      </FilterField>
      <Flex mt={2} alignSelf='flex-end'>
        <Button basic onClick={resetFilter}>Reset</Button>
        <Button primary onClick={handleApplyFilter}>Apply</Button>
      </Flex>
    </OptionsContainer>
  );
};

const FilterPopup = ({ hasFilter, onApplyFilter, ...filterProps }) => {
  const [isOpen, setOpenState] = useState(false);

  const Trigger = props => <FilterTrigger hasFilter={hasFilter} {...props} />;

  const handleApplyFilter = (...args) => {
    onApplyFilter(...args);
    setOpenState(false);
  };

  return (
    <Popup
      trigger={
        <Trigger>
          <Icon name='filter' /> Filter
        </Trigger>
      }
      open={isOpen}
      on='click'
      onOpen={() => setOpenState(true)}
      onClose={() => setOpenState(false)}
      content={<FilterView onApplyFilter={handleApplyFilter} {...filterProps} />}
      position='bottom right'
    />
  );
};

export default FilterPopup;