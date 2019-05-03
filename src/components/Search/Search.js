/**
@author Srilakshmi Prasad
**/
import React, { useState, useEffect, useRef } from 'react'
import { Segment, Menu, Icon } from 'semantic-ui-react';
import Fuse from 'fuse.js';

import SearchResults from './SearchResults';
import FilterPopup from './FilterPopup';

import { StyledSearch, MenuButton, SearchContainer } from './Search.styled';

import listingsApi from '../../api/listings';

const useEffectSkipFirst = (fn, arr) => {
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }

    fn();
  }, arr);
};

const useEffectOnAll = (fn, arr) => {
  arr.forEach(value => {
    useEffectSkipFirst(fn, [value]);
  });
};

const Search = ({ location, history }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [listings, setListings] = useState();
  const [filterOptions, setFilterOptions] = useState();
  const [fuse, setFuse] = useState();

  const filterListings = query => fuse ? fuse.search(query) : [];

  const createFilterFnFromOptions = filterOptions => {
    const { priceRange, conditions, max } = filterOptions;
    
    let [lowerBoundPrice, upperBoundPrice] = priceRange;
    
    if (upperBoundPrice === max) {
      upperBoundPrice = Infinity;
    }

    const isInPriceRange = price => price >= lowerBoundPrice && price <= upperBoundPrice;
    const hasCondition = condition => conditions.has(condition.toLowerCase());

    return listing => isInPriceRange(listing.price) && hasCondition(listing.condition);
  };

  const handleFilterChange = options => {
    const filterFn = createFilterFnFromOptions(options);
    
    setFilterOptions(options);
    setFilteredResults(results.filter(filterFn));
  };

  const handleSearch = (currentQuery = query) => setResults(currentQuery.length > 0 ? filterListings(currentQuery) : []);

  const handleInputChange = event => setQuery(event.target.value);
  const navigateToListingDetails = ({ _id }) => history.push(`/listings/${_id}`);

  const { isDefaultFilter = true } = filterOptions || {};

  const parseQueryString = () => {
    const params = new URLSearchParams(location.search);
    return {
      query: params.get('query'),
      exact: params.get('exact') === 'true',
    };
  };

  const queryFromSearchParams = () => {
    if (location.search) {
      const { query: urlQuery, exact } = parseQueryString();
      if (urlQuery === query) return;

      setQuery(urlQuery);

      if (!exact) {
        handleSearch(urlQuery);
      } else {
        setResults(listings.filter(listing => listing.book.title === urlQuery));
      }
    }
  };

  useEffect(() => {
    const fuseOptions = {
      shouldSort: true,
      threshold: 0.6,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      // Allow users to search both title and authors in case
      // of two books having similar or exactly the same titles
      keys: [
        { name: 'book.title', weight: 0.7 },
        { name: 'book.authors', weight: 0.3 },
      ]
    };

    listingsApi.get().then(({ listings }) => {
      setListings(listings);
      setFuse(new Fuse(listings, fuseOptions));
    });
  }, []);

  useEffectOnAll(queryFromSearchParams, [fuse, location.search]);

  useEffectSkipFirst(() => {
    if (filterOptions) {
      handleFilterChange(filterOptions);
    } else {
      setFilteredResults(results);
    }

    if (query && parseQueryString().query !== query) {
      history.push({
        pathname: '/listings',
        search: `?query=${query}`
      });
    }
  }, [results]);

  return (
    <SearchContainer>
      <Menu attached='top'>
        <StyledSearch
          className='aligned grow item transparent'
          icon='search'
          iconPosition='left'
          placeholder='Search listings'
          onChange={handleInputChange}
          value={query}
          onKeyDown={event => event.keyCode === 13 && handleSearch()}
        />
        <Menu.Menu position='right'>
          <MenuButton onClick={handleSearch}>
            <Icon name='search' />
          </MenuButton>
          <FilterPopup
            hasFilter={!isDefaultFilter}
            currentOptions={filterOptions}
            onApplyFilter={handleFilterChange}
          />
        </Menu.Menu>
      </Menu>
      <Segment attached='bottom'>
        <SearchResults
          results={filteredResults}
          onItemClick={navigateToListingDetails}
        />
      </Segment>
    </SearchContainer>
  );
};

export default Search;