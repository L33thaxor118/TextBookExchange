import { Button, Form, Dropdown, Checkbox, Message} from 'semantic-ui-react';
import React, { Component } from 'react';

import axios from 'axios';
import _ from 'lodash';
import { CreateListingContainer } from './CreateListing.styled';
import PhotoUploadPreview from './PhotoUploadPreview/PhotoUploadPreview';
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

function createObjectURL(object) {
    return (window.URL) ? window.URL.createObjectURL(object) : window.webkitURL.createObjectURL(object);
}


class CreateListing extends Component {
  constructor() {
    super();
    this.state = {
      imageFileList: [],
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
    this.uppyRef = React.createRef();
    this.bookOptions = [];
    this.finish = this.finish.bind(this);
    this.handleFileDrop = this.handleFileDrop.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
    this.handleRemovePhoto = this.handleRemovePhoto.bind(this);
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

  handleRemovePhoto(idx) {
    let newList = this.state.imageFileList;
    newList.splice(idx, 1);
    this.setState({
      imageFileList: newList
    });
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
      if (!this.state.selectedFromDropdownTrade && !this.state.cashOnly) {
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

    newListing.imageNames = this.state.imageFileList.map(file => (file.name));
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
    updatedListing.price = parseInt(event.target.value);
    let errors = this.state.errors;
    errors.emptyCash= false;
    this.setState({
      newlisting: updatedListing,
      errors: errors
    });
  }

  handleFileDrop(fileList) {
    this.setState({
      imageFileList: [...this.state.imageFileList, fileList[0]]
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
    var imageContainers = [];
    var imageFiles = this.state.imageFileList;
    for (let i = 0; i < imageFiles.length; i++) {
      imageContainers.push(
          <div className={'previewImage'}>
            <PhotoUploadPreview removePhoto={this.handleRemovePhoto} photo={createObjectURL(imageFiles[i])} idx = {i}/>
          </div>
      );
    }
    var exchangeBook = null;
    if (this.state.exchangeBookChecked) {
      exchangeBook = (
        <SelectBook bookOptions = {bookOptions}
          removeIsbnError = {this.removeIsbnErrorTrade}
          bookCreationHandler = {this.openModal}
          displayTitle = {this.state.displayTradeBookTitle}
          onRadioButtonChange = {this.radioButtonChanged}
          name = {"tradeFor"}
          bookSelected = {this.tradeBookSelected}
          loading = {this.state.tradeIsbnLoading}
          createBookFormISBNChanged = {this.createTradeBookFormISBNChanged}
          createBookHasFailed = {this.state.tradeIsbnNotFound}
          selectedFromDropdown = {this.state.selectedFromDropdownTrade}/>
      );
    }
    var cashInput = null;
    if (this.state.cashChecked) {
      cashInput = (
        <Form.Input onChange={this.priceChanged} label="Price" placeholder="$"/>
      );
    }
    return (
      <CreateListingContainer>
        <h1>Create a new Listing</h1>
        <div className='background'>
          <div className={'offer'}>
            <SelectBook bookOptions = {bookOptions}
              removeIsbnError = {this.removeIsbnError}
              bookCreationHandler= {this.openModal}
              onRadioButtonChange = {this.radioButtonChanged}
              displayTitle = {this.state.displayBookTitle}
              name = {"Offer"}
              bookSelected = {this.bookSelected}
              loading = {this.state.isbnLoading}
              createBookFormISBNChanged = {this.createBookFormISBNChanged}
              createBookHasFailed = {this.state.isbnNotFound}
              selectedFromDropdown = {this.state.selectedFromDropdown}/>
            <div className="offerForm">
              <Dropdown
                  placeholder='Select condition'
                  fluid
                  search
                  selection
                  options={conditionOptions}
                  onChange={this.conditionSelected}
              />
              <Message error
                hidden={!(this.state.errors.emptyBook)}>
                Please select a valid book
              </Message>
              <Message error
                hidden={!(this.state.errors.emptyCondition)}>
                Please enter your book's condition
              </Message>
            </div>
          </div>
          <div className="createListingDescription">
            <Form>
              <Form.Field>
                <h2>Description</h2>
                <Form.TextArea className={'description'}
                  placeholder='describe the book here'
                  onChange={this.descriptionChanged}/>
              </Form.Field>
            </Form>
            <h2>Upload Images</h2>
            <ImageUpload
              listingId={this.state.listingId}
              trigger = {({ onClick }) =>
                <Button color='teal' size='massive' icon='upload' onClick={onClick}></Button>}
              ref={el => this.uppyRef = el}/>
          </div>
          <div className={'tradeFor'}>
            <h2>Exchange for</h2>
            <Checkbox label='Cash' onChange={this.cashChecked} />
            <Checkbox label='Book' onChange={this.exchangeBookChecked} />
            {cashInput}
            {exchangeBook}
            <Message error
              hidden={!(this.state.errors.emptyExchangeBook)}>
              Please select a valid book
            </Message>
            <Message error
              hidden={!(this.state.errors.emptyCash)}>
              You selected cash. Please specify a price
            </Message>
            <Message error
              hidden={!(this.state.errors.emptyExchange)}>
              Please select at least one option
            </Message>
          </div>
          <Message error
            hidden={!(this.state.errors.internal)}>
            Internal error. Please try again later
          </Message>
          <Button type='submit' color='blue' onClick={this.clearErrors}>Create</Button>
        </div>
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
