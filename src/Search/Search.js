/** 
@author Srilakshmi Prasad
**/
import React, { Component } from 'react'
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
    const { listings } = await listingsApi.get();
    this.setState({ listings });
  }

  // Filter array items based on search criteria (title)
  filterListings = query => this.state.listings
    ? this.state.listings.filter(el => el.title.toLowerCase().indexOf(query.toLowerCase()) > -1)
    : [];

  // redraws component on state change
  handleInputChange = event => {
    const query = event.target.value;
    this.setState({
      results: query.length > 0 ? this.filterListings(query) : []
    });
  };

  // render search results with assistance of Suggestion component 
  render() {
    const { results } = this.state;
    return (
      <form>
        <input
          placeholder="Search for listings..."
          ref={input => this.search = input}
          onChange={this.handleInputChange}
        />
        <ul>
          {results.map(item => <span key={item.title}>{item.title}<br></br></span>)}
        </ul>
      </form>
    )
  }
}

export default Search;