import React, { Component } from 'react';
import { Message, Input, Button, Form } from 'semantic-ui-react';
import { Box } from '@rebass/grid';
import { SelectBookContainer, BookOption, RadioField, StyledSearch, Header } from './SelectBook.styled';
import CreateBookModal from '../CreateBookModal/CreateBookModal';
import _ from 'lodash';

const resRender = ({ title, authors }) => (
  <BookOption key={title}>
    <div name='title'>{title}</div>
    <div name='authors'>{authors.join(',  ')}</div>
  </BookOption>
);

class SelectBook extends Component {
  state = {
    dropdownEnabled: true,
    isbnEnabled: false,
    isbnInput: "",
    modalOpen: false,
    isSearchLoading: false
  };

  constructor(props) {
    super(props);
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

  openModal = () => this.setState({ modalOpen: true });

  closeModal = () => this.setState({ modalOpen: false });

  isbnInputChanged(event) {
    this.props.removeIsbnError();
    this.setState({
      isbnInput: event.target.value
    });
  }

  render() {
    const { dropdownEnabled, isbnEnabled, results } = this.state;

    return (
      <SelectBookContainer>
        <Header>Select a Book</Header>
        <RadioField active={dropdownEnabled}>
          <Form.Radio
            label='Find by name'
            name={this.props.name}
            value={'dropdown' + this.props.name}
            checked={dropdownEnabled}
            onChange={this.handleRadioChange}
          />
          {dropdownEnabled && (
            <StyledSearch
              ref={this.searchRef}
              disabled={!dropdownEnabled}
              placeholder='Search for Books'
              results={results}
              onResultSelect={this.props.bookSelected}
              onSearchChange={_.debounce(this.handleSearchChange, 500, { leading: true })}
              minCharacters={3}
              resultRenderer={resRender}
            />
          )}
        </RadioField>
        <Form.Radio
          label='Find by ISBN'
          name={this.props.name}
          value={'isbn' + this.props.name}
          checked={isbnEnabled === true}
          onChange={this.handleRadioChange}
        />
        {this.state.isbnEnabled && (
          <Box mt={2}>
            <Input placeholder='Enter 10 or 13 digit ISBN'
              disabled={!isbnEnabled}
              onChange={this.isbnInputChanged}
              loading={this.props.loading}
              action={<Button icon='search' onClick={this.searchForISBN} />}
              onKeyDown={event => {
                if (event.keyCode === 13) {
                  event.preventDefault();
                  this.searchForISBN();
                }
              }}
            />
            {this.props.createBookHasFailed && (
              <Box ml='50px' style={{display: 'inline-block'}}>
                <Button
                  type='submit'
                  onClick={this.openModal}
                  color='blue'
                  content='Create new book'
                />
              </Box>
            )}
          </Box>
        )}
        {this.props.createBookHasFailed && (
          <div className='errorMessage'>
            <Message
              size='mini'
              color='red'
              content='Not found'
            />
          </div>
        )}
        <Message hidden={!this.props.displayTitle}>{this.props.displayTitle}</Message>
        <CreateBookModal
          open={this.state.modalOpen}
          close={this.closeModal}
        />
      </SelectBookContainer>
    );
  }

}

export default SelectBook;
