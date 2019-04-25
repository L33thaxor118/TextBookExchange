import { Button, Form, TextArea,  Dropdown } from 'semantic-ui-react';
import React, { Component } from 'react';
import styles from './CreateListing.css';
import UploadComponent from './UploadComponent/UploadComponent';
import PhotoUploadPreview from './PhotoUploadPreview/PhotoUploadPreview';
import { storage, authentication } from '../Utils/Firebase/firebase'
import { connect } from 'react-redux';
import { get_books } from '../Redux/Actions/index';

const mapStateToProps = (state) => {
  return {
    books: state.books,
    hasErrored: state.booksError
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getData: () => dispatch(get_books())
  };
}

const mockListingObject = {
    _id: '4ecc05e55dd98a436ddcc47c',
    description: 'testing',
    status: 'incomplete',
    photo_names: [],
    listedBy: '1aac05e55da23fsd436cc47c',
    price: 20,
  };

const conditionOptions = [
    { key: 'Very Worn', text: 'Very Worn', value: 'Very Worn' },
    { key: 'Slightly Worn', text: 'Slightly Worn', value: 'Slightly Worn' },
    { key: 'Good', text: 'Good', value: 'Good' },
    { key: 'Like New', text: 'Like New', value: 'Like New' },
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

      newBookFormTitle: "",
      newBookFormISBN: "",

      newTradeBookFormTitle: "",
      newTradeBookFormISBN: ""
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
    this.createBookFormTitleChanged = this.createBookFormTitleChanged.bind(this);
    this.createTradeBookFormISBNChanged = this.createTradeBookFormISBNChanged.bind(this);
    this.createTradeBookFormTitleChanged = this.createTradeBookFormTitleChanged.bind(this);
  }

  componentDidMount() {
    this.props.getData();
    // axios.get('https://uofi-book-exchange-backend.herokuapp.com/books')
    // .then(response=> {
    //   console.log(response);
    //this.bookOptions = setupDropdownObjects(this.props.books);
    const user = authentication.currentUser
    const listing = {
      bookId:"",
      bookTitle: "",
      userId: user == null ? null : user.uid,
      condition: "",
      price: 0,
      tradeBookId: "",
      tradeBookTitle: "",
      description: ""
    }
    this.setState({
      books: this.props.books,
      newListing: listing
    });
      // this.books = response.data.books;
      // console.log(this.books)
    }

  handleRemovePhoto(idx) {
    let newList = this.state.imageFileList;
    newList.splice(idx, 1);
    this.setState({
      imageFileList: newList
    });

  }

  handleCreate() {
    // let newListing = {
    //   isbn:
    // }
    // axios.post('https://uofi-book-exchange-backend.herokuapp.com/listings', newListing
    // ).then(response=>{
    //  console.log(response)
    // }).catch(error => {
    //  console.log(error)
    // });
    //make POST request with other fields. add image_names as photo_names since
    //that is how they will be stored in firebase. use returned ID to upload
    //to a folder named after ID
    //something like mockListingObject is returned by POST
    //DISPATCH

    // const listing = {};
    // this.props.createListing(listing);
    console.log(this.state.newListing)

    var storageRef = storage.ref();
    for (let i = 0; i < this.state.imageFileList.length; i++) {
      let imageFile = this.state.imageFileList[i];
      var imgref = storageRef.child(mockListingObject._id + '/' + imageFile.name);
      imgref.put(imageFile).then(function(snapshot) {
        console.log('Uploaded a blob or file!');
      }).catch(function(error){console.log(error.message)});
    }
  }

  tradeBookSelected(event, data) {
    const { value } = data;
    const updatedListing = this.state.newListing;
    updatedListing.tradeBookId = "";
    updatedListing.tradeBookTitle = "";
    if (value == "None") {
      this.setState({
        newListing: updatedListing,
        selectedFromDropdownTrade: false
      })
    } else {
      const { text } = data.options.find(o => o.value === value);
      const updatedListing = this.state.newListing;
      updatedListing.tradeBookId = value;
      updatedListing.tradeBookTitle = text;
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
    updatedListing.bookTitle = "";
    if (value == "None") {
      this.setState({
        newListing: updatedListing,
        selectedFromDropdown: false
      })
    } else {
      const { text } = data.options.find(o => o.value === value);
      const updatedListing = this.state.newListing;
      updatedListing.bookId = value;
      updatedListing.bookTitle = text;
      this.setState({
        newListing: updatedListing,
        selectedFromDropdown: true
      });
    }
  }

  createBookFormISBNChanged(event) {
    this.setState({
      newBookFormISBN: event.target.value
    });
  }

  createBookFormTitleChanged(event) {
    this.setState({
      newBookFormTitle: event.target.value
    });
  }

  createTradeBookFormISBNChanged(event) {
    this.setState({
      newTradeBookFormISBN: event.target.value
    });
  }

  createTradeBookFormTitleChanged(event) {
    this.setState({
      newTradeBookFormTitle: event.target.value
    });
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
    updatedListing.price = event.target.value;
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
    bookOptions.unshift({key: "no_select", text: "Enter your own", value: "None" })
    return (
      <div className={styles.container}>
        <Form>
        <div className={styles.SelectBook}>
          <div className={styles.bookSelection}>
            <div className={styles.bookDropdown}>
              <h2>Select a book from our list </h2>
              <Dropdown
                  placeholder='Select Book'
                  fluid
                  search
                  selection
                  options={bookOptions}
                  onChange={this.bookSelected}
                />
              </div>
            <h1> OR </h1>
            <div className={styles.createBookForm}>
              <h2>Enter your own:</h2>
              <Form>
                <Form.Group widths='equal'>
                  <Form.Input fluid label='ISBN' placeholder='' onChange= {this.createBookFormISBNChanged} disabled={this.state.selectedFromDropdown} />
                  <Form.Input fluid label='Title' placeholder='' onChange= {this.createBookFormTitleChanged} disabled={this.state.selectedFromDropdown}/>
                </Form.Group>
              </Form>
            </div>
          </div>
        </div>
          <Form.Field>
            <label>Description</label>
            <Form.TextArea placeholder='describe the book here' onChange={this.descriptionChanged}/>
          </Form.Field>
          <Dropdown
              placeholder='Select condition'
              fluid
              search
              selection
              options={conditionOptions}
              onChange={this.conditionSelected}
          />
          <Form.Field>
            <label>Price</label>
            <input placeholder='$' onChange={this.priceChanged}/>
          </Form.Field>
          <div className={styles.SelectBook}>
            <div className={styles.bookSelection}>
              <div className={styles.bookDropdown}>
                <h2>Select a book from our list </h2>
                <Dropdown
                    placeholder='Select Book'
                    fluid
                    search
                    selection
                    options={bookOptions}
                    onChange={this.tradeBookSelected}
                  />
                </div>
              <h1> OR </h1>
              <div className={styles.createBookForm}>
                <h2>Enter your own:</h2>
                <Form>
                  <Form.Group widths='equal'>
                    <Form.Input fluid label='ISBN' placeholder='' onChange= {this.createTradeBookFormISBNChanged} disabled={this.state.selectedFromDropdownTrade} />
                    <Form.Input fluid label='Title' placeholder='' onChange= {this.createTradeBookFormTitleChanged} disabled={this.state.selectedFromDropdownTrade}/>
                  </Form.Group>
                </Form>
              </div>
            </div>
          </div>
          <Button type='submit' onClick={this.handleCreate}>Create</Button>
        </Form>
        <div className={styles.uploadComponentContainer}>
          <UploadComponent handleFileDrop = {this.handleFileDrop}></UploadComponent>
        </div>
        {imageContainers}
      </div>
    );
  }



}

// connect(state => ( {
//   displayName: state.user.displayname}, dispatch=>
// }), dispatch => ({
//   createListing: listing => dispatch(createListing.start(listing)),
// }))

/*

*/

export default connect(mapStateToProps, mapDispatchToProps)(CreateListing);
