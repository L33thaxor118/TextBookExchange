import React from 'react';
import { Divider, Form, Button, Icon, Message, Label} from 'semantic-ui-react';
import {fetchPhotoUrls} from '../../utils/firebase';
import { Flex } from '@rebass/grid';
import _ from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PhotoUploadPreview from '../CreateListing/PhotoUploadPreview/PhotoUploadPreview';
import ImageUpload from '../ImageUpload';

import {
  ModifyListingContainer,
  ExchangeHeader,
  PhotosContainer,
  MessageDeleted,
  MessageCompleted
} from './ModifyListing.styled';

import listingsApi from '../../api/listings';

const conditionOptions = [
    { key: 'new', text: 'new', value: 'new' },
    { key: 'like new', text: 'like new', value: 'like new' },
    { key: 'used - very good', text: 'used - very good', value: 'used - very good' },
    { key: 'used - good', text: 'used - good', value: 'used - good' },
    { key: 'used - acceptable', text: 'used - acceptable', value: 'used - acceptable' }
];

class ModifyListing extends React.Component {

  constructor() {
    super();
    this.state = {
      listing: null,
      photoUrls: [],
      addedPhotoNames: [],
      removedPhotoNames: [],
      deleted: false,
      updated: false,
      errors: {
        emptyPrice: false,
        emptyCondition: false,
        internal: false
      }
    };
    this.uppyRef = React.createRef();
    this.handleExistingPhotoRemoved = this.handleExistingPhotoRemoved.bind(this);
    this.handleUploadPhotoAdded = this.handleUploadPhotoAdded.bind(this);
    this.handleUploadPhotoRemoved = this.handleUploadPhotoRemoved.bind(this);
    this.handleUpdateClicked = this.handleUpdateClicked.bind(this);
    this.handleCancelClicked = this.handleCancelClicked.bind(this);
    this.handleDeleteClicked = this.handleDeleteClicked.bind(this);
    this.handleConditionChanged = this.handleConditionChanged.bind(this);
    this.handlePriceChanged = this.handlePriceChanged.bind(this);
    this.handleDescriptionChanged = this.handleDescriptionChanged.bind(this);
    this.handleMarkAsComplete = this.handleMarkAsComplete.bind(this);
    this.handleMarkAsIncomplete = this.handleMarkAsIncomplete.bind(this);
    this.validateUpdate = this.validateUpdate.bind(this);
    this.clearErrors = this.clearErrors.bind(this);
    this.updateListing = this.updateListing.bind(this);
    this.leaveHandler = this.leaveHandler.bind(this);
  }

  async componentDidMount() {
    const { id } = this.props.match.params;
    const { listing } = await listingsApi.get({ id });
    let photoUrls = [];
    try{
    photoUrls = await fetchPhotoUrls(listing._id, listing.imageNames);
    } catch(error) {console.log(error)}
    this.setState({
      listing: listing,
      updatedListing: listing,
      photoUrls: photoUrls
    });
  }

  handleExistingPhotoRemoved(idx) {
    let newPhotoUrls = this.state.photoUrls;
    let removedPhotoUrl = this.state.photoUrls[idx];
    let imageNames = this.state.listing.imageNames;
    let removedPhotoName = null;
    console.log(imageNames);
    console.log(removedPhotoUrl)
    for (let i = 0; i < imageNames.length; i++) {
      let imageNameSanitized = imageNames[i].replace(/,/g, "%2C");
      console.log(imageNameSanitized);
      if (removedPhotoUrl.includes(imageNameSanitized)) {
        removedPhotoName = imageNames[i];
        break;
      }
    }
    console.log(removedPhotoName)
    if (removedPhotoName == null) {
      let errors = this.state.errors;
      errors.internal = true;
      this.setState({errors});
      return;
    }
    newPhotoUrls.splice(idx, 1);
    this.setState({
      photoUrls: newPhotoUrls,
      removedPhotoNames: [...this.state.removedPhotoNames, removedPhotoName]
    })
  }

  leaveHandler() {
    this.props.history.push('/dashboard');
  }

  handleUploadPhotoAdded({name}) {
    let found = this.state.addedPhotoNames.find(imgName=>{return imgName === name});
    if (found !== undefined) return;
    this.setState({
      addedPhotoNames: [...this.state.addedPhotoNames, name]
    }, ()=>{console.log(this.state.addedPhotoNames)});
  }

  handleUploadPhotoRemoved({name}) {
    let idx = 0;
    let newList = this.state.addedPhotoNames;
    for (let i = 0; i < newList.length; i++) {
      if (newList[i] === name) break;
      idx++;
    }
    newList.splice(idx, 1);
    this.setState({
      addedPhotoNames: newList
    }, ()=>{console.log(this.state.addedPhotoNames)});
  }

  handleUpdateClicked() {
    this.clearErrors();
  }

  clearErrors() {
    let errors = this.state.errors;
    errors = _.mapValues(errors, () => false);
    this.setState({errors: errors}, ()=>{this.validateUpdate()});
  }

  validateUpdate() {
    let listingKeys = Object.keys(this.state.listing);
    console.log(this.state.listing);
    let errors = this.state.errors;
    if ( !listingKeys.includes('exchangeBook') &&
        this.state.listing.price === 0) {
      errors.emptyPrice = true;
    }
    this.setState({errors});
    for (let key in errors) {
      if (errors[key] === true) {
          return;
      }
    }
    this.updateListing();
  }

  async updateListing() {
    //let oldImageNames = this.state.listing.imageNames;
    //let filteredImageNames = oldImageNames.filter(
    //  name => !this.state.removedPhotoNames.includes(name));
    //let newImageNames = [...filteredImageNames, this.state.addedPhotoNames];
    try {
      // await deleteListingPhotos(this.state.listing._id, this.state.removedPhotoNames);
      // await this.uppyRef.upload();
      // await listingsApi.update(this.state.listing);
      //this.props.history.push('/listings/' + this.state.listing._id);
      this.setState({updated: true});
    }
    catch(err){
      console.log(err);
      let errors = this.state.errors;
      errors.internal = true;
      this.setState({errors});
    }
    // await this.uppyRef.upload();
  }

  handleCancelClicked() {
    this.props.history.push('/dashboard');
  }

  async handleDeleteClicked() {
    try {
      await listingsApi.delete({id: this.state.listing._id});
      this.setState({deleted: true})
    } catch {
      let errors = this.state.errors;
      errors.internal = true;
      this.setState({errors});
    }
  }

  handleMarkAsComplete() {
    try {
      let listing = this.state.listing;
      listing.statusCompleted = true;
      this.setState({listing});
    }
    catch{
      let errors = this.state.errors;
      errors.internal = true;
      this.setState({errors});
    }
  }

  handleMarkAsIncomplete() {
    try {
      let listing = this.state.listing;
      listing.statusCompleted = false;
      this.setState({listing});
    }
    catch{
      let errors = this.state.errors;
      errors.internal = true;
      this.setState({errors});
    }
  }

  handleConditionChanged(event, {value}) {
    let listing = this.state.listing;
    listing.condition = value;
    this.setState({
      listing
    })
  }

  handlePriceChanged(event, data) {
    let listing = this.state.listing;
    let errors = this.state.errors;
    errors.emptyPrice = false;
    if (event.target.value.length === 0) {
      listing.price = 0;
    } else {
      listing.price = parseInt(event.target.value);
    }
    this.setState({
      listing,
      errors
    })
  }

  handleDescriptionChanged(event, data) {
    let listing = this.state.listing;
    listing.description = event.target.value;
    this.setState({
      listing
    })
  }

  render() {
    const { listing } = this.state;
    if (!listing) return null;
    let photos = [];
    for (let i = 0; i < this.state.photoUrls.length; i++) {
      photos.push((
        <PhotoUploadPreview idx={i}
        removePhoto={this.handleExistingPhotoRemoved}
        photo={this.state.photoUrls[i]}
        />
      ));
    }
    if (this.state.deleted) {
      return (
        <MessageDeleted>
          <Flex flexDirection='column'>
            <Message success icon='check'>
              Successfuly deleted Listing
            </Message>
            <Button color='blue' onClick={this.leaveHandler}>Go Back</Button>
          </Flex>
        </MessageDeleted>
      );
    }
    else if (this.state.listing.statusCompleted) {
      return (
        <MessageCompleted>
          <Flex flexDirection='column'>
            <Message info>
              This listing has been marked completed.
              This means it no longer appears for other users.
              To reopen and edit, click below
            </Message>
            <Button color='blue' onClick={this.handleMarkAsIncomplete}>Reopen</Button>
            <Message error
              hidden={!(this.state.errors.internal)}>
              Internal error. Please try again later
            </Message>
          </Flex>
        </MessageCompleted>
      );
    }
    return (
        <ModifyListingContainer completed={this.state.listing.statusCompleted}>
          <div className='background'>
            <h1> Modify your Listing </h1>
            <ExchangeHeader>
              <Flex flexDirection='column' flexGrow='1'>
                <div className='bookTitle'>{listing.book.title}</div>
                <div className='authorsList'>{listing.book.authors.join(', ')}</div>
              </Flex>
              <FontAwesomeIcon icon='exchange-alt' size='2x'/>
              <Flex flexDirection='column' flexGrow='1'>
                <div className='bookTitle'>{listing.exchangeBook ? listing.exchangeBook.title : ""}</div>
                <div className='authorsList'>{listing.exchangeBook ? listing.exchangeBook.authors.join(', ') : ""}</div>
                <Label size='medium' icon='money bill alternate' >${listing.price ? listing.price : '--'} </Label>
              </Flex>
            </ExchangeHeader>
            <Button animated color='green' onClick={this.handleMarkAsComplete}>
              <Button.Content visible>Mark as Complete</Button.Content>
              <Button.Content hidden>
                <Icon name='handshake outline' />
              </Button.Content>
            </Button>
            <Flex flexDirection='column' width={1}>
              <Divider />
              <Form>
                <Form.TextArea className={'description'}
                  label='Description'
                  value={this.state.listing.description}
                  placeholder='describe the book here'
                  onChange={this.handleDescriptionChanged}/>

                <Form.Field inline>
                  <label>Condition</label>
                  <Form.Select options={conditionOptions}
                    value={this.state.listing.condition}
                    placeholder='Condition'
                    onChange={this.handleConditionChanged}/>
                </Form.Field>

                <Form.Field inline>
                  <Form.Input label='Price'
                    error={this.state.errors.emptyPrice}
                    placeholder='$'
                    value={this.state.listing.price}
                    onChange={this.handlePriceChanged} />
                </Form.Field>
              </Form>
            <h3> Remove Photos </h3>
            <PhotosContainer>
            {photos}
            </PhotosContainer>
            <h3> Upload more </h3>
            <ImageUpload
              listingId={this.state.listing._id}
              trigger = {({ onClick }) =>
                <Button color='teal' size='massive' icon='upload' onClick={onClick}></Button>}
              ref={el => this.uppyRef = el}
              onFileAdded={this.handlePhotoAdded}
              onFileRemoved={this.handlePhotoRemoved}/>
            </Flex>
            <Message error
              hidden={!(this.state.errors.internal)}>
              Internal error. Please try again later
            </Message>
            <Message success icon='check'
              hidden={!(this.state.updated)}>
              Successfuly updated listing
            </Message>
            <div className='endButtons'>
              <Flex flexDirection='row' justifyContent='space-around'>
              <Button fluid color='green' onClick={this.handleUpdateClicked}> Update Listing</Button>
              <Button fluid color='red' onClick={this.handleCancelClicked}> Cancel </Button>
              <Button fluid color='red' inverted onClick={this.handleDeleteClicked}> Delete </Button>
              </Flex>
            </div>
          </div>
        </ModifyListingContainer>
      );
  }
};

export default ModifyListing;
