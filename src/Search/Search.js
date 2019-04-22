/** 
@author Srilakshmi Prasad
**/
import React, { Component } from 'react'
import axios from 'axios'
import Suggestions from './Suggestions'

// update API params!
const { API_KEY } = process.env
const API_URL = ''

class Search extends Component {
    // maintain query in state and search results
    state = {
      query: '',
      results: []
    }
  
    // API requesting function to obtain search results
    getInfo = () => {
      axios.get(`${API_URL}?api_key=${API_KEY}&prefix=${this.state.query}`)
        .then(({ data }) => {
          this.setState({
            results: data.data                           
          })
        })
    }
  
    // redraws comoponent on state change
    handleInputChange = () => {
      this.setState({
        query: this.search.value
      }, () => {
        if (this.state.query && this.state.query.length > 1) {
            if (this.state.query.length % 2 === 0) {
              this.getInfo()
            }
        } 
        else if (!this.state.query) {
            // handle no query here
        }
      })
    }
  
    // render search results with assistance of Suggestion component 
    render() {
      return (
        <form>
          <input
            placeholder="Search for listings..."
            ref={input => this.search = input}
            onChange={this.handleInputChange}
          />
          <p>{this.state.query}</p>
          {/* Uncomment below when API results are successful */}
          {/* <Suggestions results={this.state.results} /> */}
        </form>
      )
    }
  }

export default Search