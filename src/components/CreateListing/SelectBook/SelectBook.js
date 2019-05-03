import React, { Component } from 'react';
import { Search, Message, Input, Radio, Button} from 'semantic-ui-react';
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
      isbnInput: "",
      modalOpen: false,
      isSearchLoading: false
    };
    this.searchRef = React.createRef();
    this.handleRadioChange = this.handleRadioChange.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.resetSearch = this.resetSearch.bind(this);
    this.searchForISBN = this.searchForISBN.bind(this);
    this.isbnInputChanged = this.isbnInputChanged.bind(this);
  }

  searchForISBN() {
    this.props.createBookFormISBNChanged(this.state.isbnInput);
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
    this.props.removeIsbnError();
    if (value === ('isbn' + this.props.name)){
      let searchRef = this.searchRef.current;
      searchRef.setValue('');
      this.setState({
        isbnEnabled: true,
        dropdownEnabled: false,
        isSearchLoading: false,
        results: [],
        value: ''
      });
    } else if (value === ('dropdown' + this.props.name)) {
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
  isbnInputChanged(event) {
    console.log(event.target.value);
    this.props.removeIsbnError();
    this.setState({
      isbnInput: event.target.value
    });
  }

  render() {
    let errorMessage = null;
    if (this.props.createBookHasFailed) {
      errorMessage = (
        <div className='errorMessage'>
          <Message
            size='mini'
            color='red'
            fluid
            content={"Not found"}
          />
        </div>
      );
    }
    let search = null;
    if (this.state.dropdownEnabled) {
      search = (
        <Search
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
      );
    }
    var input = null;
    let createButton = null;
    if (this.props.createBookHasFailed) {
      createButton = (
        <Button type='submit' onClick={this.openModal}>Create</Button>
      );
    }
    if (this.state.isbnEnabled) {
      input = (
        <div className={'inputBox'}>
          <Input placeholder='Enter 10 or 13 digit ISBN'
            disabled = {!this.state.isbnEnabled}
            onChange= {this.isbnInputChanged}
            loading = {this.props.loading}
          />
          <Button onClick={this.searchForISBN}>Search</Button>
          {createButton}
        </div>
      );
    }
    return (
      <SelectBookContainer disabled = {this.props.disabled}>
      <h2>Select a Book</h2>
        <SelectBookRadioGroup selected = {this.state.dropdownEnabled}>
          <div className={'radioSelection'}>
            <Radio
              name={this.props.name}
              value={'dropdown' + this.props.name}
              checked={this.state.dropdownEnabled === true}
              onChange={this.handleRadioChange} />
            <p>Find by name</p>
          </div>
          {search}
        </SelectBookRadioGroup>
        <SelectBookRadioGroup selected = {this.state.isbnEnabled}>
        <div className={'radioSelection'}>
          <Radio
            name={this.props.name}
            value={'isbn' + this.props.name}
            checked={this.state.isbnEnabled === true}
            onChange={this.handleRadioChange} />
          <p>Find by ISBN:</p>
        </div>
          <div className={'inputContainer'}>
            {input}
            {errorMessage}
            <Message hidden={!this.props.displayTitle}>{this.props.displayTitle}</Message>
          </div>
        </SelectBookRadioGroup>
        <CreateBookModal
          open = {this.state.modalOpen}
          close = {this.closeModal}
        />
      </SelectBookContainer>
    );
  }

}

export default SelectBook;
