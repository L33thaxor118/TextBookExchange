import React from 'react';
import { Divider, Form, Button, Icon} from 'semantic-ui-react';
import {fetchPhotoUrls} from '../../utils/firebase';
import { Flex } from '@rebass/grid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PhotoUploadPreview from '../CreateListing/PhotoUploadPreview/PhotoUploadPreview';

import {
  ModifyListingContainer,
  ExchangeHeader,
  PhotosContainer
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
      updatedListing: {},
      photoUrls: [],
      addedPhotoNames: [],
      removedPhotoNames: [],
      errors: {
        emptyPrice: false,
        emptyCondition: false,
        internal: false
      }
    };
    this.handleExistingPhotoRemoved = this.handleExistingPhotoRemoved.bind(this);
    this.handleUploadPhotoAdded = this.handleUploadPhotoAdded.bind(this);
    this.handleUploadPhotoRemoved = this.handleUploadPhotoRemoved.bind(this);
    this.handleUpdateClicked = this.handleUpdateClicked.bind(this);
    this.handleCancelClicked = this.handleCancelClicked.bind(this);
    this.handleDeleteClicked = this.handleDeleteClicked.bind(this);
    this.handleConditionChanged = this.handleConditionChanged.bind(this);
    this.handlePriceChanged = this.handlePriceChanged.bind(this);
    this.handleDescriptionChanged = this.handleDescriptionChanged.bind(this);

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
    let photoName = this.state.listing.imageNames[idx];
    console.log(newPhotoUrls[idx]);
    console.log(photoName);
    newPhotoUrls.splice(idx, 1);
    this.setState({
      photoUrls: newPhotoUrls,
      removedPhotoNames: [...this.state.removedPhotoNames, photoName]
    })
  }

  handleUploadPhotoAdded({name}) {

  }

  handleUploadPhotoRemoved({name}) {

  }

  handleUpdateClicked() {

  }
  handleCancelClicked() {

  }
  handleDeleteClicked() {

  }
  handleConditionChanged() {

  }
  handlePriceChanged() {

  }
  handleDescriptionChanged() {

  }

  render() {
    const { listing } = this.state;
    let photos = [];
    for (let i = 0; i < this.state.photoUrls.length; i++) {
      photos.push((
        <PhotoUploadPreview idx={i}
        removePhoto={this.handlePhotoRemoved}
        photo={this.state.photoUrls[i]}
        />
      ));
    }
    return (
      listing ? (
        <ModifyListingContainer>
          <div className='background'>
            <h1> Modify your Listing </h1>
            <ExchangeHeader>
              <Flex flexDirection='column'>
                <div className='bookTitle'>{listing.book.title}</div>
                <div className='authorsList'>{listing.book.authors.join(', ')}</div>
              </Flex>
              <FontAwesomeIcon icon='exchange-alt' size='2x'/>
              <Flex flexDirection='column'>
                <div className='bookTitle'>{listing.exchangeBook ? listing.exchangeBook.title : ""}</div>
                <div className='authorsList'>{listing.exchangeBook ? listing.exchangeBook.authors.join(', ') : ""}</div>
                <div className='price'>Price: ${listing.price ? listing.price : '--'} </div>
              </Flex>
            </ExchangeHeader>
            <Button animated color='green'>
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
                  placeholder='describe the book here'
                  onChange={this.descriptionChanged}/>

                <Form.Field inline>
                  <label>Condition</label>
                  <Form.Select options={conditionOptions} placeholder='Condition' />
                </Form.Field>

                <Form.Field inline error>
                  <Form.Input label='Price' placeholder='$'/>
                </Form.Field>
              </Form>
            <h3> Photos </h3>
            <PhotosContainer>
            {photos}
            </PhotosContainer>
            <h3> Upload more </h3>
            <Button color='teal' icon='upload' size='huge'/>
            </Flex>

            <div className='endButtons'>
              <Flex flexDirection='row' justifyContent='space-around'>
              <Button fluid color='green'> Update Listing</Button>
              <Button fluid color='red'> Cancel </Button>
              <Button fluid color='red' inverted> Delete </Button>
              </Flex>
            </div>
          </div>
        </ModifyListingContainer>
      ) : null
    );
  }
};

export default ModifyListing;
