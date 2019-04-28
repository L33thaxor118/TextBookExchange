/** 
@author Srilakshmi Prasad
**/
import React, { Component } from 'react'
import { Segment, Menu, Icon, Popup } from 'semantic-ui-react';
import Fuse from 'fuse.js';

import { StyledSearch, CreateListingButton, SearchContainer } from './Search.styled';

import listingsApi from '../api/listings';

class Search extends Component {
  // maintain query in state and search results
  state = {
    query: '',
    // currently contains mock JSON objects
    results: [],
    listings: null,
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

  // redraws component on state change
  handleInputChange = event => {
    const query = event.target.value;
    this.setState({
      results: query.length > 0 ? this.filterListings(query) : []
    });
  };

  redirectToCreateListing = () => this.props.history.push('/listings/new');

  // render search results with assistance of Suggestion component 
  render() {
    const { results } = this.state;
    
    const Trigger = props => <CreateListingButton {...props} />;

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
          <ul>
            {results.map((item, i) => <div key={i}>{item.book.title}</div>)}
          </ul>
        </Segment>
      </SearchContainer>
    )
  }
}

export default Search;