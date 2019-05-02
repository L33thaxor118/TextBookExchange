import { Button, Form, Dropdown, Checkbox, Message} from 'semantic-ui-react';
import React, { Component } from 'react';

import axios from 'axios';
import _ from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CreateListingContainer, Exchange, CreateListingMainForm } from './CreateListing.styled';
import UploadComponent from './UploadComponent/UploadComponent';
import PhotoUploadPreview from './PhotoUploadPreview/PhotoUploadPreview';
import SelectBook from './SelectBook/SelectBook'
import { authentication, uploadPhotos, fetchPhotoUrls } from '../../utils/firebase'
import { connect } from 'react-redux';
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
      cashOnly: false,

      newBookFormISBN: "",
      displayBookTitle: "",
      isbnLoading: false,
      isbnNotFound: false,

      newTradeBookFormISBN: "",
      displayTradeBookTitle: "",
      tradeIsbnLoading: false,
      tradeIsbnNotFound: false,

      errors:  {},
      modalOpen: false
    }
    this.offerBookRef = React.createRef();
    this.tradeBookRef = React.createRef();
    this.bookOptions = [];
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
    this.checkboxChanged = this.checkboxChanged.bind(this);
    this.clearErrors = this.clearErrors.bind(this);
    this.validateListing = this.validateListing.bind(this);
    this.setInternalError = this.setInternalError.bind(this);
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
      emptyCondition: false
    }

    this.setState({
      books: this.props.books,
      newListing: listing,
      errors: errors
    });
  }

  handleRemovePhoto(idx) {
    let newList = this.state.imageFileList;
    newList.splice(idx, 1);
    this.setState({
      imageFileList: newList
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
    if (this.state.selectedFromDropdown && newListing.bookId === "") errors.emptyBook = true;
    if (!this.state.selectedFromDropdown && this.state.displayBookTitle === "") errors.emptyBook = true;
    if ((this.state.selectedFromDropdownTrade && newListing.exchangeBook === "") && !this.state.cashOnly) errors.emptyExchangeBook = true;
    if ((!this.state.selectedFromDropdownTrade && this.state.displayTradeBookTitle === "") && !this.state.cashOnly) errors.emptyExchangeBook = true;
    if (newListing.price === 0 && this.state.cashOnly) errors.emptyCash = true;
    if (newListing.condition === "") errors.emptyCondition = true;
    this.setState({errors:errors});
    return _.some(errors, true);
  }

  async handleCreate() {
    if (this.validateListing()) {
      setTimeout(this.clearErrors, 6000);
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
      if (this.state.cashOnly) delete newListing.exchangeBook;
      let createdListing = await this.props.createListing(newListing);
      await uploadPhotos(createdListing._id, this.state.imageFileList);
      console.log("successfuly uploaded photos");
      console.log(await fetchPhotoUrls(createdListing._id, createdListing.imageNames));
      this.props.history.push('/listings/' + createdListing._id);
    } catch(error) {
      console.log("internal error");
      this.setInternalError();
      return;
    }
  }

  clearErrors(){
    let errors = this.state.errors;
    errors = _.mapValues(errors, () => false);
    this.setState({errors: errors});
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
    this.setState({
      newListing: updatedListing
    });
  }

  bookSelected(event, {result}) {
    const updatedListing = this.state.newListing;
    updatedListing.bookId = result.id;
    this.setState({
      newListing: updatedListing
    });
  }

  async createBookFormISBNChanged(event) {
    let digits = event.target.value.length;
    this.setState({
      newBookFormISBN: event.target.value,
      isbnLoading: digits? true : false,
      isbnNotFound: false,
      displayBookTitle: ""
    });
    if (digits === 10 || digits === 13) {
      let book = this.checkIfBookExists(event.target.value);
      if (book != null) {
        this.setState({
          isbnLoading: false,
          isbnNotFound: false,
          displayBookTitle: book.title + " by " + book.authors
        });
        return;
      }
      try {
        let response = await lookupBookByISBN(event.target.value);
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
  }

  async createTradeBookFormISBNChanged(event) {
    let digits = event.target.value.length;
    this.setState({
      newTradeBookFormISBN: event.target.value,
      tradeIsbnLoading: digits? true : false,
      tradeIsbnNotFound: false,
      displayTradeBookTitle: ""
    });
    if (digits === 10 || digits === 13) {
      let book = this.checkIfBookExists(event.target.value);
      if (book != null) {
        this.setState({
          tradeIsbnLoading: false,
          tradeIsbnNotFound: false,
          displayTradeBookTitle: book.title
        });
        return;
      }
      try {
        let response = await lookupBookByISBN(event.target.value);
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
    this.setState({
      newListing: updatedListing
    });
  }

  priceChanged(event){
    const updatedListing = this.state.newListing;
    updatedListing.price = parseInt(event.target.value);
    this.setState({
      newlisting: updatedListing
    });
  }

  handleFileDrop(fileList) {
    this.setState({
      imageFileList: [...this.state.imageFileList, fileList[0]]
    });
  }

  checkboxChanged(event, {checked}) {
    console.log(checked);
    this.setState({
      cashOnly: checked
    });
  }


  render() {
    var imageContainers = [];
    var imageFiles = this.state.imageFileList;
    for (let i = 0; i < imageFiles.length; i++) {
      imageContainers.push(
          <div className={'previewImage'}>
          <PhotoUploadPreview removePhoto={this.handleRemovePhoto} photo={createObjectURL(imageFiles[i])} idx = {i}/>
          </div>
        );
    }
    var bookOptions = this.props.books.map( book => ({isbn: book.isbn, title: book.title, authors: book.authors, id: book._id }) )
    return (
      <CreateListingContainer>
        <Exchange>

          <div className={'offer'}>
            <h1>What you've got</h1>
            <SelectBook bookOptions = {bookOptions}
              bookCreationHandler= {this.openModal}
              onRadioButtonChange = {this.radioButtonChanged}
              displayTitle = {this.state.displayBookTitle}
              name = {"Offer"}
              bookSelected = {this.bookSelected}
              loading = {this.state.isbnLoading}
              createBookFormISBNChanged = {this.createBookFormISBNChanged}
              createBookHasFailed = {this.state.isbnNotFound}
              selectedFromDropdown = {this.state.selectedFromDropdown}/>
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
                Please select a book
              </Message>
              <Message error
                hidden={!(this.state.errors.emptyCondition)}>
                Please enter your book's condition
              </Message>
          </div>
          <FontAwesomeIcon className={'icon'} icon="exchange-alt" size="3x"/>
          <div className={'tradeFor'}>
            <h1>What you're looking for</h1>
            <SelectBook bookOptions = {bookOptions}
              bookCreationHandler = {this.openModal}
              disabled = {this.state.cashOnly}
              displayTitle = {this.state.displayTradeBookTitle}
              onRadioButtonChange = {this.radioButtonChanged}
              name = {"tradeFor"}
              bookSelected = {this.tradeBookSelected}
              loading = {this.state.tradeIsbnLoading}
              createBookFormISBNChanged = {this.createTradeBookFormISBNChanged}
              createBookHasFailed = {this.state.tradeIsbnNotFound}
              selectedFromDropdown = {this.state.selectedFromDropdownTrade}/>
            <Form.Input onChange={this.priceChanged} label="I also want Cash" placeholder="$"/>
            <Checkbox label='I only want cash. No books' onChange={this.checkboxChanged} />
            <Message error
              hidden={!(this.state.errors.emptyExchangeBook)}>
              Please enter a valid book or select CASH ONLY
            </Message>
            <Message error
              hidden={!(this.state.errors.emptyCash)}>
              You selected cash only. Please specify a price
            </Message>
          </div>
        </Exchange>

        <CreateListingMainForm>
          <Form>
            <Form.Field>
              <label>Description</label>
              <Form.TextArea className={'description'} placeholder='describe the book here' onChange={this.descriptionChanged}/>
            </Form.Field>
          </Form>

          <div className={'uploadComponentContainer'}>
            <div className={'dragbox'}>
              <UploadComponent handleFileDrop = {this.handleFileDrop}/>
            </div>
            <div className={'imagesContainer'}>
              {imageContainers}
            </div>
          </div>
          <Message error
            hidden={!(this.state.errors.internal)}>
            Internal error. Please try again later.
          </Message>
          <Button type='submit' onClick={this.handleCreate}>Create</Button>
        </CreateListingMainForm>
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
