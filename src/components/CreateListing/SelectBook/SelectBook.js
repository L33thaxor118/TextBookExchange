import React, { Component } from 'react';
import { Dropdown, Search, Message, Input, Radio, Button, Modal, Form, Label} from 'semantic-ui-react';
import { SelectBookContainer, SelectBookRadioGroup } from './SelectBook.styled';
import CreateBookModal from '../CreateBookModal/CreateBookModal';
import _ from 'lodash';

const resRender = ({ title, authors }) => (
      <span key="title">
        {title} by {authors}
      </span>
    );

class SelectBook extends Component {
  constructor() {
    super();
    this.state = {
      dropdownEnabled: true,
      isbnEnabled: false,
      modalOpen: false,
      isSearchLoading: false
    };
    this.searchRef = React.createRef();
    this.handleRadioChange = this.handleRadioChange.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.resetSearch = this.resetSearch.bind(this);
  }

  resetSearch() {
    this.setState({ isSearchLoading: false, results: [], value: '' })
  }

  handleSearchChange(e, {value}) {
    this.setState({ isSearchLoading: true, value });
    setTimeout(() => {
      if (value.length < 1) return this.resetSearch()

      const re = new RegExp(_.escapeRegExp(value), 'i')
      const isMatch = result => re.test(result.title)
      console.log(this.source);
      this.setState({
        isLoading: false,
        results: _.filter(this.props.bookOptions, isMatch),
      })
    }, 300)
  }

  handleRadioChange(event, { value }) {
    if (value == ('isbn' + this.props.name)){
      let searchRef = this.searchRef.current;
      searchRef.setValue('');
      this.setState({
        isbnEnabled: true,
        dropdownEnabled: false,
        isSearchLoading: false,
        results: [],
        value: ''
      });
    } else if (value == ('dropdown' + this.props.name)) {
      this.setState({
        isbnEnabled: false,
        dropdownEnabled: true
      });
    }
    this.props.onRadioButtonChange(value);
  }

  openModal() {
    this.setState({
      modalOpen: true
    });
  }

  closeModal() {
    this.setState({
      modalOpen: false
    });
  }

  render() {
    let errorMessage = null;
    if (this.props.createBookHasFailed) {
      errorMessage = (
        <div>
          <Message
            color='red'
            header='Error'
            content={"failed to find ISBN"}
          />
          <Button type='submit' onClick={this.openModal}>Create your own</Button>
        </div>
      );

    }
    return (
      <SelectBookContainer disabled = {this.props.disabled}>
        <SelectBookRadioGroup selected = {this.state.dropdownEnabled}>
          <Radio className={'radio'}
            name={this.props.name}
            value={'dropdown' + this.props.name}
            checked={this.state.dropdownEnabled == true}
            onChange={this.handleRadioChange} />
          <h3>Select a book from our list: </h3>
          <Search className={'dropdown'}
              ref = {this.searchRef}
              disabled = {!this.state.dropdownEnabled}
              placeholder='Search for Books'
              results={this.state.results}
              onResultSelect={this.props.bookSelected}
              onSearchChange={_.debounce(this.handleSearchChange, 500, {
              leading: true,
            })}
              minCharacters={3}
              resultRenderer={resRender}
            />
        </SelectBookRadioGroup>
        <SelectBookRadioGroup selected = {this.state.isbnEnabled}>
          <Radio className={'radio'}
            name={this.props.name}
            value={'isbn' + this.props.name}
            checked={this.state.isbnEnabled == true}
            onChange={this.handleRadioChange} />
          <h3>Find by ISBN:</h3>
          <Input className={'input'} placeholder='Enter 10 or 13 digit ISBN'
            disabled = {!this.state.isbnEnabled}
            onChange= {this.props.createBookFormISBNChanged}
            loading = {this.props.loading}
             />
          <Label>{this.props.displayTitle}</Label>
          {errorMessage}
        </SelectBookRadioGroup>
        <CreateBookModal open = {this.state.modalOpen} close = {this.closeModal}/>
      </SelectBookContainer>
    );
  }

}

export default SelectBook;
