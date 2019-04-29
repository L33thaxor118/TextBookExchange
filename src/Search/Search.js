/** 
@author Srilakshmi Prasad
**/
import React, { Component } from 'react'
import axios from 'axios'

// API params for axios usage
// const { API_KEY } = process.env
// const API_URL = ''

const mockData = [
  {
    bookId: 123456,
    title: 'Introduction to Meme Culture',
    condition: 'new',
    price: 30,
    statusCompleted: false,
    dateCreated: Date.now,
    assignedUserId: 'sprasad7'
  }, 
  {
    bookId: 123457,
    title: 'Mechanical Physics',
    condition: 'like new',
    price: 60,
    statusCompleted: true,
    dateCreated: Date.now,
    assignedUserId: 'nanadav2'
  },
  {
    bookId: 123458,
    title: 'Basket Weaving',
    condition: 'new',
    price: 10,
    statusCompleted: true,
    dateCreated: Date.now,
    assignedUserId: 'jasmeet3'
  },
  {
    bookId: 123459,
    title: 'Underwater Architecture',
    condition: 'old',
    price: 20,
    statusCompleted: false,
    dateCreated: Date.now,
    assignedUserId: 'raisin4'
  }
];

// Filter array items based on search criteria (title)
function filterListings(arr, query) {
  return arr.filter(function(el) {
      return el.title.toString().toLowerCase().indexOf(query.toLowerCase()) > -1;
  })
}

class Search extends Component {
    // maintain query in state and search results
    state = {
      query: '',
      // currently contains mock JSON objects
      results: []
    };
  
    // API requesting function to obtain search results
    getInfo = () => { 
      // TBD 
    }
  
    // redraws comoponent on state change
    handleInputChange = event => {
      const query = event.target.value;

      // query has been entered
      if(query.length > 0) {
        const filtered = filterListings(mockData, query);
        this.setState({
          results: filtered
        });
        // this.getInfo();
      }
      
      // no query
      else {
        this.setState({
          results: []
        });
      }
    }

    // render search results with assistance of Suggestion component 
    render() {
      const { query, results } = this.state;
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

export default Search