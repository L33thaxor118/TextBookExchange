import { Button, Form, Message} from 'semantic-ui-react';
import React, { Component } from 'react';

import axios from 'axios';
import _ from 'lodash';
import { CreateListingContainer, StyledFormSelect, UploadTrigger, CheckboxField } from './CreateListing.styled';
import SelectBook from './SelectBook/SelectBook'
import { authentication } from '../../utils/firebase'
import { connect } from 'react-redux';
import ImageUpload from '../ImageUpload';
import { getBooks, createBook, createListing } from '../../redux/actions/index';

const lookupBookByISBN = isbn => axios.get('https://www.googleapis.com/books/v1/volumes?q=isbn:' + isbn).then(({ data }) => data);

const conditionOptions = [
    { key: 'new', text: 'new', value: 'new' },
    { key: 'like new', text: 'like new', value: 'like new' },
    { key: 'used - very good', text: 'used - very good', value: 'used - very good' },
    { key: 'used - good', text: 'used - good', value: 'used - good' },
    { key: 'used - acceptable', text: 'used - acceptable', value: 'used - acceptable' }
];


class CreateListing extends Component {
  constructor() {
    super();
    this.state = {
      imageNames: [],
      books: [],
      selectedFromDropdown: true,
      selectedFromDropdownTrade: true,
      newListing: {},

      newBookFormISBN: "",
      displayBookTitle: "",
      isbnLoading: false,
      isbnNotFound: false,

      newTradeBookFormISBN: "",
      displayTradeBookTitle: "",
      tradeIsbnLoading: false,
      tradeIsbnNotFound: false,
      cashChecked: false,
      exchangeBookChecked: false,

      errors:  {},
      modalOpen: false,
      listingId: ""
    }
    this.bookOptions = [];
    this.finish = this.finish.bind(this);
    this.handleFileAdded = this.handleFileAdded.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
    this.handleFileRemoved = this.handleFileRemoved.bind(this);
    this.bookSelected = this.bookSelected.bind(this);
    this.tradeBookSelected = this.tradeBookSelected.bind(this);
    this.conditionSelected = this.conditionSelected.bind(this);
    this.descriptionChanged = this.descriptionChanged.bind(this);
    this.priceChanged = this.priceChanged.bind(this);
    this.createBookFormISBNChanged = this.createBookFormISBNChanged.bind(this);
    this.createTradeBookFormISBNChanged = this.createTradeBookFormISBNChanged.bind(this);
    this.checkIfBookExists = this.checkIfBookExists.bind(this);
    this.radioButtonChanged = this.radioButtonChanged.bind(this);
    this.cashChecked = this.cashChecked.bind(this);
    this.exchangeBookChecked = this.exchangeBookChecked.bind(this);
    this.clearErrors = this.clearErrors.bind(this);
    this.validateListing = this.validateListing.bind(this);
    this.setInternalError = this.setInternalError.bind(this);
    this.removeIsbnError = this.removeIsbnError.bind(this);
    this.removeIsbnErrorTrade = this.removeIsbnErrorTrade.bind(this);
    this.checkIfCashOnly = this.checkIfCashOnly.bind(this);
  }

  async componentDidMount() {
    if (this.props.listing != null) {
      console.log("modify mode")
    }
    await this.props.getData();
    const user = authentication.currentUser
    const listing = {
      bookId:"",
      description: "",
      imageNames: [],
      condition: "",
      price: 0,
      exchangeBook: "",
      userId: user == null ? null : user.uid
    };
    const errors = {
      internal: false,
      emptyExchangeBook: false,
      emptyBook: false,
      emptyCash: false,
      emptyCondition: false,
      emptyExchange: false
    }
    this.setState({
      books: this.props.books,
      newListing: listing,
      errors: errors
    });
  }

  checkIfCashOnly(){
    if (this.state.cashChecked && !this.state.exchangeBookChecked) return true;
    else return false;
  }

  removeIsbnError() {
    this.setState({
      displayBookTitle: "",
      isbnNotFound: false
    });
  }

  removeIsbnErrorTrade() {
    this.setState({
      displayTradeBookTitle: "",
      tradeIsbnNotFound: false
    });
  }

  checkIfBookExists(isbn) {
    for (let i = 0; i < this.props.books.length; i++) {
      if (this.props.books[i].isbn === isbn) return this.props.books[i];
    }
    return null;
  }

  setInternalError() {
    let errors = this.state.errors;
    errors.internal = true;
    this.setState({errors: errors});
    setTimeout(this.clearErrors, 6000);
  }

  validateListing() {
    console.log(this.state.newListing);
    let errors = this.state.errors;
    let newListing = this.state.newListing;
    if (!this.state.cashChecked && !this.state.exchangeBookChecked) {
      errors.emptyExchange = true;
    }
    if (this.state.selectedFromDropdown && newListing.bookId === ""){
      errors.emptyBook = true;
    }
    if (!this.state.selectedFromDropdown && this.state.displayBookTitle === ""){
      errors.emptyBook = true;
    }
    if ((this.state.selectedFromDropdownTrade && newListing.exchangeBook === "")
          && this.state.exchangeBookChecked){
      errors.emptyExchangeBook = true;
    }
    if ((!this.state.selectedFromDropdownTrade &&
          this.state.displayTradeBookTitle === "") && this.state.exchangeBookChecked){
      errors.emptyExchangeBook = true;
    }
    if (newListing.price === 0 && this.state.cashChecked) {
      errors.emptyCash = true;
    }
    if (newListing.condition === "") {
      errors.emptyCondition = true;
    }
    this.setState({errors:errors});
    for (let key in errors) {
      if (errors[key] === true) {
          return true;
      }
    }
    return false;
  }


  async handleCreate() {
    if (this.validateListing()) {
      return;
    }
    let newListing = this.state.newListing;
    if (this.state.cashOnly) newListing.exchangeBook = "";
    try{
      if (!this.state.selectedFromDropdown) {
        let book = {};
        book = this.checkIfBookExists(this.state.newBookFormISBN);
        if (book == null) {
          book = await this.props.createBook({isbn: this.state.newBookFormISBN});
        }
        newListing.bookId = book._id;
      }
      if (!this.state.selectedFromDropdownTrade && this.state.exchangeBookChecked) {
        let tradebook = {};
        tradebook = this.checkIfBookExists(this.state.newTradeBookFormISBN);
        if (tradebook == null) {
          tradebook = await this.props.createBook({isbn: this.state.newTradeBookFormISBN});
        }
        newListing.exchangeBook = tradebook._id;
      }
    } catch(error) {
        this.setInternalError();
        return;
    }

    newListing.imageNames = this.state.imageNames;
    console.log(newListing);
    try {
      if (this.checkIfCashOnly()) delete newListing.exchangeBook;
      let createdListing = await this.props.createListing(newListing);
      this.setState({listingId: createdListing._id}, ()=> {this.finish()});
    } catch(error) {
      this.setInternalError();
      return;
    }
  }

  async finish() {
    console.log(this.state.listingId);
    await this.uppyRef.upload();
    this.props.history.push('/listings/' + this.state.listingId);
  }

  clearErrors(){
    let errors = this.state.errors;
    errors = _.mapValues(errors, () => false);
    this.setState({errors: errors}, ()=>{this.handleCreate()});
  }

  radioButtonChanged(buttonVal) {
    let listing = this.state.newListing;
    switch(buttonVal) {
      case "isbnOffer":
      listing.bookId = "";
      this.setState({ newListing: listing, selectedFromDropdown: false});
      break;

      case "dropdownOffer":
      this.setState({ selectedFromDropdown: true, isbnLoading:false});
      break;

      case "isbntradeFor":
      listing.exchangeBook = "";
      this.setState({ newListing: listing, selectedFromDropdownTrade: false });
      break;

      case "dropdowntradeFor":
      this.setState({ selectedFromDropdownTrade: true, tradeIsbnLoading:false });
      break;

      default:
    }
  }

  tradeBookSelected(event, {result}) {
    const updatedListing = this.state.newListing;
    updatedListing.exchangeBook = result.id;
    let errors = this.state.errors;
    errors.emptyExchangeBook= false;
    this.setState({
      newListing: updatedListing,
      errors: errors
    });
  }

  bookSelected(event, {result}) {
    const updatedListing = this.state.newListing;
    updatedListing.bookId = result.id;
    let errors = this.state.errors;
    errors.emptyBook= false;
    this.setState({
      newListing: updatedListing,
      errors: errors
    });
  }

  async createBookFormISBNChanged(isbn) {
    let digits = isbn.length;
    if (digits === 0) return;
    let errors = this.state.errors;
    errors.emptyBook= false;
    this.setState({
      newBookFormISBN: isbn,
      isbnLoading: digits? true : false,
      isbnNotFound: false,
      displayBookTitle: "",
      errors: errors
    });
    let book = this.checkIfBookExists(isbn);
    if (book != null) {
      this.setState({
        isbnLoading: false,
        isbnNotFound: false,
        displayBookTitle: book.title + " by " + book.authors
      });
      return;
    }
    try {
      let response = await lookupBookByISBN(isbn);
      let title = response.items[0].volumeInfo.title;
      let authors = response.items[0].volumeInfo.authors;
      this.setState({
        isbnLoading: false,
        isbnNotFound: false,
        displayBookTitle: title + " by " + authors
      });
    } catch {
      this.setState({
        isbnLoading: false,
        isbnNotFound: true
      });
    }
  }

  async createTradeBookFormISBNChanged(isbn) {
    let digits = isbn.length;
    if (digits === 0) return;
    let errors = this.state.errors;
    errors.emptyExchangeBook= false;
    this.setState({
      newTradeBookFormISBN: isbn,
      tradeIsbnLoading: digits? true : false,
      tradeIsbnNotFound: false,
      displayTradeBookTitle: "",
      errors: errors
    });
    let book = this.checkIfBookExists(isbn);
    if (book != null) {
      this.setState({
        tradeIsbnLoading: false,
        tradeIsbnNotFound: false,
        displayTradeBookTitle: book.title
      });
      return;
    }
    try {
      let response = await lookupBookByISBN(isbn);
      let title = response.items[0].volumeInfo.title;
      this.setState({
        tradeIsbnLoading: false,
        tradeIsbnNotFound: false,
        displayTradeBookTitle: title
      });
    } catch {
      this.setState({
        tradeIsbnLoading: false,
        tradeIsbnNotFound: true
      });
    }
  }


  descriptionChanged(event, {value}) {
    const updatedListing = this.state.newListing;
    updatedListing.description = value;
    this.setState({
      newListing: updatedListing
    });
  }

  conditionSelected(event, {value}) {
    const updatedListing = this.state.newListing;
    updatedListing.condition = value;
    let errors = this.state.errors;
    errors.emptyCondition= false;
    this.setState({
      newListing: updatedListing,
      errors: errors
    });
  }

  priceChanged(event){
    const updatedListing = this.state.newListing;
    if (event.target.value.length === 0) {
      updatedListing.price = 0;
    } else {
      updatedListing.price = parseInt(event.target.value);
    }
    let errors = this.state.errors;
    errors.emptyCash= false;
    this.setState({
      newlisting: updatedListing,
      errors: errors
    });
  }

  handleFileRemoved({name}) {
    let idx = 0;
    let newList = this.state.imageNames;
    for (let i = 0; i < newList.length; i++) {
      if (newList[i] === name) break;
      idx++;
    }
    newList.splice(idx, 1);
    this.setState({
      imageNames: newList
    });
  }

  handleFileAdded({name}) {
    let found = this.state.imageNames.find(imgName=>{return imgName === name});
    if (found !== undefined) return;
    this.setState({
      imageNames: [...this.state.imageNames, name]
    });
  }

  cashChecked(event, {checked}) {
    let errors = this.state.errors;
    errors.emptyExchange= false;
    this.setState({
      cashChecked: checked,
      errors: errors
    });
  }

  exchangeBookChecked(event, {checked}) {
    let errors = this.state.errors;
    errors.emptyExchange= false;
    this.setState({
      exchangeBookChecked: checked,
      errors: errors
    });
  }

  render() {
    var bookOptions = this.props.books.map( book => ({isbn: book.isbn, title: book.title, authors: book.authors, id: book._id }) )

    return (
      <CreateListingContainer>
        <h1>Create a New Listing</h1>
        <div className='background'>
          <Form>
            <SelectBook
              bookOptions={bookOptions}
              removeIsbnError={this.removeIsbnError}
              bookCreationHandler={this.openModal}
              onRadioButtonChange={this.radioButtonChanged}
              displayTitle={this.state.displayBookTitle}
              name='Offer'
              bookSelected={this.bookSelected}
              loading={this.state.isbnLoading}
              createBookFormISBNChanged = {this.createBookFormISBNChanged}
              createBookHasFailed={this.state.isbnNotFound}
              selectedFromDropdown={this.state.selectedFromDropdown}
            />
            <StyledFormSelect
              placeholder='Condition'
              label='Condition'
              fluid
              search
              selection
              options={conditionOptions}
              onChange={this.conditionSelected}
            />
            <Form.TextArea
              label='Description'
              className='description'
              onChange={this.descriptionChanged}
              placeholder='Provide a brief description of the book and its condition'
            />
            <ImageUpload
              listingId={this.state.listingId}
              trigger={({ onClick }) => (
                <UploadTrigger active={this.state.imageNames.length}>
                  <Form.Button
                    label='Upload Images'
                    size='massive'
                    icon='upload'
                    onClick={onClick}
                  />
                </UploadTrigger>
              )}
              ref={el => this.uppyRef = el}
              onFileAdded={this.handleFileAdded}
              onFileRemoved={this.handleFileRemoved}
            />
            {/* Inline styles because I don't feel like making another styled component lol */}
            <div style={{
              fontWeight: 'bold',
              fontSize: '14px',
              marginTop: '15px',
              marginBottom: '10px'
            }}>
              Exchange for
            </div>
            <CheckboxField active={this.state.cashChecked}>
              <Form.Checkbox label='Cash' onChange={this.cashChecked} />
              {this.state.cashChecked && (
                <Form.Input inline onChange={this.priceChanged} label="Price" placeholder="$"/>
              )}
            </CheckboxField>
            <CheckboxField active={this.state.exchangeBookChecked}>
              <Form.Checkbox label='Book' onChange={this.exchangeBookChecked} />
              {this.state.exchangeBookChecked && (
                <SelectBook
                  bookOptions={bookOptions}
                  removeIsbnError={this.removeIsbnErrorTrade}
                  bookCreationHandler={this.openModal}
                  displayTitle={this.state.displayTradeBookTitle}
                  onRadioButtonChange={this.radioButtonChanged}
                  name='tradeFor'
                  bookSelected={this.tradeBookSelected}
                  loading={this.state.tradeIsbnLoading}
                  createBookFormISBNChanged={this.createTradeBookFormISBNChanged}
                  createBookHasFailed={this.state.tradeIsbnNotFound}
                  selectedFromDropdown={this.state.selectedFromDropdownTrade}
                />
              )}
            </CheckboxField>
          </Form>
          <Message error
            hidden={!(this.state.errors.emptyExchangeBook)}>
            You selected to exchange for a book. Please select a valid book
          </Message>
          <Message error
            hidden={!(this.state.errors.emptyCash)}>
            You selected cash. Please specify a price
          </Message>
          <Message
            error
            hidden={!this.state.errors.emptyBook}
            content='Please select a valid book to offer'
          />
          <Message
            error
            hidden={!this.state.errors.emptyCondition}
            content="Please enter your book's condition"
          />
          <Message error
            hidden={!(this.state.errors.emptyExchange)}>
            Please select at least one checkBox
          </Message>
          <Button type='submit' color='blue' onClick={this.clearErrors}>Create</Button>
        </div>
        <Message error
          hidden={!(this.state.errors.internal)}>
          Internal error. Please try again later
        </Message>
      </CreateListingContainer>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    books: state.books,
    createBookHasFailed: state.createBookHasFailed,
    createListingHasFailed: state.createListingHasFailed
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getData: () => dispatch(getBooks.start()),
    createBook: book => dispatch(createBook.start(book)),
    createListing: listing => dispatch(createListing.start(listing))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateListing);
