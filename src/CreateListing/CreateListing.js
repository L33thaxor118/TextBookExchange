import { Button, Form, Header, TextArea,  Dropdown, Message, Modal} from 'semantic-ui-react';
import React, { Component } from 'react';
import styles from './CreateListing.css';

import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from './CreateListing.module.scss';
import UploadComponent from './UploadComponent/UploadComponent';
import PhotoUploadPreview from './PhotoUploadPreview/PhotoUploadPreview';
import SelectBook from './SelectBook/SelectBook'
import { storage, authentication, uploadPhotos, fetchPhotoUrls } from '../Utils/Firebase/firebase'
import { connect } from 'react-redux';
import { get_books, post_book, post_book_failure, post_listing} from '../Redux/Actions/index';

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

function setupDropdownObjects(books) {
  var objs = [];
  objs.push({key: "no_select", text: "Enter your own", value: "None" })
  for (let i = 0; i < books.length; i++) {
    var obj = {
      key: books[i].isbn,
      text: books[i].title,
      value: books[i]._id
    }
    objs.push(obj);
  }
  return objs;
}
// function revokeObjectURL(url) {
//     return (window.URL) ? window.URL.revokeObjectURL(url) : window.webkitURL.revokeObjectURL(url);
// }

class CreateListing extends Component {
  constructor() {
    super();
    this.state = {
      imageFileList: [],
      books: [],
      selectedFromDropdown: false,
      selectedFromDropdownTrade: false,
      newListing: {},

      newBookFormISBN: "",
      isbnLoading: false,
      isbnNotFound: false,

      newTradeBookFormISBN: "",
      tradeIsbnLoading: false,
      tradeIsbnNotFound: false
    }
    //this.books = [];
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
  }

  componentDidMount() {
    if (this.props.listing != null) {
      console.log("modify mode")
      this.state.newListing = this.props.listing;
    }
    this.props.getData();
    const user = authentication.currentUser
    const listing = {
      bookId:"",
      title: "",
      description: "",
      imageNames: [],
      condition: "",
      price: 0,
      exchangeBook: "",
      userId: user == null ? null : user.uid,
      description: ""
    }
    this.setState({
      books: this.props.books,
      newListing: listing
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
      if (this.props.books[i].isbn == isbn) return this.props.books[i];
    }
    return null;
  }

async handleCreate() {
    let newListing = this.state.newListing;
    if (this.state.isbnNotFound && !this.state.selectedFromDropdown) return;
    if (this.state.tradeIsbnNotFound && !this.state.selectedFromDropdownTrade) return;
    this.props.setBookCreateFailure(false);

    if (!this.state.selectedFromDropdown) {
      let book = {};
      book = this.checkIfBookExists(this.state.newBookFormISBN);
      if (book == null) {
        book = await this.props.createBook({isbn: this.state.newBookFormISBN});
      }
      newListing.bookId = book._id;
      newListing.title = book.title;
    }
    if (!this.state.selectedFromDropdownTrade) {
      let tradebook = {};
      tradebook = this.checkIfBookExists(this.state.newTradeBookFormISBN);
      if (tradebook == null) {
        tradebook = await this.props.createBook({isbn: this.state.newTradeBookFormISBN});
      }
      newListing.exchangeBook = tradebook._id;
    }
    newListing.imageNames = this.state.imageFileList.map(file => (file.name));
    console.log(newListing);
    delete newListing.title;
    let createdListing = await this.props.createListing(newListing);
    if (createdListing != undefined) await uploadPhotos(createdListing._id, this.state.imageFileList);
    console.log(await fetchPhotoUrls(createdListing._id, createdListing.imageNames));
  }

  tradeBookSelected(event, data) {
    const { value } = data;
    const updatedListing = this.state.newListing;
    updatedListing.exchangeBook = "";
    if (value == "None") {
      this.setState({
        newListing: updatedListing,
        selectedFromDropdownTrade: false
      })
    } else {
      const { text } = data.options.find(o => o.value === value);
      const updatedListing = this.state.newListing;
      updatedListing.exchangeBook = value;
      this.setState({
        newListing: updatedListing,
        selectedFromDropdownTrade: true
      });
    }
  }

  bookSelected(event, data) {
    const { value } = data;
    const updatedListing = this.state.newListing;
    updatedListing.bookId = "";
    updatedListing.title = "";
    if (value == "None") {
      this.setState({
        newListing: updatedListing,
        selectedFromDropdown: false
      })
    } else {
      const { text } = data.options.find(o => o.value === value);
      const updatedListing = this.state.newListing;
      updatedListing.bookId = value;
      updatedListing.title = text;
      this.setState({
        newListing: updatedListing,
        selectedFromDropdown: true
      });
    }
  }

  async createBookFormISBNChanged(event) {
    this.setState({
      newBookFormISBN: event.target.value,
      isbnLoading: true,
      isbnNotFound: false
    });
    try {
      let response = await lookupBookByISBN(event.target.value);
      let notFound = false;
      if (response.totalItems < 1) notFound = true;
      this.setState({
        isbnLoading: false,
        isbnNotFound: notFound
      });
    } catch {
      this.setState({
        isbnLoading: false,
        isbnNotFound: true
      });
    }
  }

  async createTradeBookFormISBNChanged(event) {
    this.setState({
      newTradeBookFormISBN: event.target.value,
      tradeIsbnLoading: true,
      tradeIsbnNotFound: false
    });
    try {
      let response = await lookupBookByISBN(event.target.value);
      let notFound = false;
      if (response.totalItems < 1) notFound = true;
      this.setState({
        tradeIsbnLoading: false,
        tradeIsbnNotFound: notFound
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

  render() {
    var imageContainers = [];
    var imageFiles = this.state.imageFileList;
    for (let i = 0; i < imageFiles.length; i++) {
      imageContainers.push(
          <PhotoUploadPreview removePhoto={this.handleRemovePhoto} photo={createObjectURL(imageFiles[i])} idx = {i}/>
        );
    }
    var bookOptions = this.props.books.map( book => ({key: book.isbn, text: book.title, value: book._id }) )
    bookOptions.unshift({key: "no_select", text: "use ISBN", value: "None" })

    return (
      <div className={styles.container}>
        <div className={styles.exchange}>
          <div className={styles.offer}>
          <h1>What you've got</h1>
          <SelectBook bookOptions = {bookOptions}
            bookSelected = {this.bookSelected}
            loading = {this.state.isbnLoading}
            createBookFormISBNChanged = {this.createBookFormISBNChanged}
            createBookHasFailed = {this.state.isbnNotFound}
            selectedFromDropdown = {this.state.selectedFromDropdown}/>
          </div>
          <FontAwesomeIcon className={styles.icon} icon="exchange-alt" size="3x"/>
          <div className={styles.tradeFor}>
          <h1>What you're looking for</h1>
          <SelectBook bookOptions = {bookOptions}
            bookSelected = {this.tradeBookSelected}
            loading = {this.state.tradeIsbnLoading}
            createBookFormISBNChanged = {this.createTradeBookFormISBNChanged}
            createBookHasFailed = {this.state.tradeIsbnNotFound}
            selectedFromDropdown = {this.state.selectedFromDropdownTrade}/>
          <Form.Input onChange={this.priceChanged} label="I also/only want Cash" placeholder="$"/>
          </div>
        </div>

        <div className={styles.mainForm}>
          <Form>
            <Form.Field>
              <label>Description</label>
              <Form.TextArea className={styles.description} placeholder='describe the book here' onChange={this.descriptionChanged}/>
            </Form.Field>
            <Dropdown
                placeholder='Select condition'
                fluid
                search
                selection
                options={conditionOptions}
                onChange={this.conditionSelected}
            />
          </Form>

          <div className={styles.uploadComponentContainer}>
            <UploadComponent handleFileDrop = {this.handleFileDrop}></UploadComponent>
            {imageContainers}
          </div>
          <Button type='submit' onClick={this.handleCreate}>Create</Button>
        </div>

        <Modal open={this.props.createBookHasFailed}>
            <Modal.Content>
              <Modal.Description>
                <p>FAILED TO CREATE LISTING</p>
              </Modal.Description>
            </Modal.Content>
        </Modal>

      </div>
    );
  }

}

const mapStateToProps = (state) => {
  return {
    books: state.books,
    getBooksHasFailed: state.getBooksHasFailed,
    createBookHasFailed: state.createBookHasFailed,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getData: () => dispatch(get_books()),
    createBook: (book, trade) => dispatch(post_book(book, trade)),
    setBookCreateFailure: (bool) => dispatch(post_book_failure(bool)),
    createListing: (listing) => dispatch(post_listing(listing))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateListing);
