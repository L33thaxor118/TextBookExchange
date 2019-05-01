/**
@author Srilakshmi Prasad
**/
import React, { Component } from 'react'
import { Segment, Menu, Icon, Popup } from 'semantic-ui-react';
import Fuse from 'fuse.js';

import SearchResults from './SearchResults';
import FilterPopup from './FilterPopup';

import { StyledSearch, MenuButton, SearchContainer } from './Search.styled';

import listingsApi from '../../api/listings';

class Search extends Component {
  // maintain query in state and search results
  state = {
    query: '',
    results: [],
    filteredResults: [],
    listings: null,
    filterOptions: null,
  };

  async componentDidMount() {
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

    const { listings } = await listingsApi.get();
    this.setState({ listings });
    this.fuse = new Fuse(listings, fuseOptions);
  }

  // Filter array items based on search criteria (title)
  // Fuzzy search over book title AND authors
  filterListings = query => this.fuse ? this.fuse.search(query) : [];

  createFilterFnFromOptions = filterOptions => {
    const { priceRange, conditions, max } = filterOptions;
    
    let [lowerBoundPrice, upperBoundPrice] = priceRange;
    
    if (upperBoundPrice === max) {
      upperBoundPrice = Infinity;
    }

    const isInPriceRange = price => price >= lowerBoundPrice && price <= upperBoundPrice;
    const hasCondition = condition => conditions.has(condition.toLowerCase());

    return listing => isInPriceRange(listing.price) && hasCondition(listing.condition);
  };

  // redraws component on state change
  handleInputChange = event => {
    const query = event.target.value;
    this.setState({
      results: query.length > 0 ? this.filterListings(query) : []
    }, () => {
      const { filterOptions, results } = this.state;
      if (filterOptions) {
        this.handleFilterChange(filterOptions);
      } else {
        this.setState({ filteredResults: results });
      }
    });
  };

  handleFilterChange = filterOptions => {
    const { results } = this.state;
    const filterFn = this.createFilterFnFromOptions(filterOptions);

    const filteredResults = results.filter(filterFn);

    this.setState({
      filterOptions,
      filteredResults,
    });
  };

  navigateToListingDetails = ({ _id }) => this.props.history.push(`/listings/${_id}`);

  redirectToCreateListing = () => this.props.history.push('/listings/new');

  // render search results with assistance of Suggestion component 
  render() {
    const { filteredResults, filterOptions } = this.state;
    const { isDefaultFilter = true } = filterOptions || {};
    
    const Trigger = props => <MenuButton {...props} />;

    return (
      <SearchContainer>
        <Menu attached='top'>
          <StyledSearch
            className='aligned grow item transparent'
            icon='search'
            iconPosition='left'
            placeholder='Search listings'
            onChange={this.handleInputChange}
          />
          <Menu.Menu position='right'>
            <FilterPopup
              hasFilter={!isDefaultFilter}
              currentOptions={this.state.filterOptions}
              onApplyFilter={this.handleFilterChange}
            />
            <Popup
              trigger={
                <Trigger onClick={this.redirectToCreateListing}>
                  <Icon name='add' />
                </Trigger>
              }
              content='Create a new listing'
              position='bottom center'
            />
          </Menu.Menu>
        </Menu>
        <Segment attached='bottom'>
          <SearchResults
            results={filteredResults}
            onItemClick={this.navigateToListingDetails}
          />
        </Segment>
      </SearchContainer>
    )
  }
}

export default Search;
