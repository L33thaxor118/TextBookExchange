import React from 'react';
import moment from 'moment';
import { Button, Divider, Segment } from 'semantic-ui-react';
import { Flex } from '@rebass/grid';
import PhotosCarousel from './PhotosCarousel/PhotosCarousel';
import './ListingDetails.scss'
import { fetchPhotoUrls } from '../../utils/firebase';
import { connect } from 'react-redux';


import {
  ListingContainer,
  AuthorsList,
  BookTitle,
  Price,
  Isbn,
} from './ListingDetails.styled';

import listingsApi from '../../api/listings';


class ListingDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listing: null,
      photos:[]
    };
    this.handleEditClicked = this.handleEditClicked.bind(this);
  }

  async componentDidMount() {
    console.log(this.props.user);
    const { id } = this.props.match.params;
    const { listing } = await listingsApi.get({ id });
    console.log(listing);
    this.setState({ listing });
    const photoUrls = await fetchPhotoUrls(listing._id, listing.imageNames);
    console.log(photoUrls);
    var photos = photoUrls;
    if (photoUrls.length === 0) {
      photos.push('https://cor-cdn-static.bibliocommons.com/assets/default_covers/icon-book-93409e4decdf10c55296c91a97ac2653.png');
    }
    console.log(photos);
    this.setState({photos});
  }

  handleEditClicked() {
    this.props.history.push('/listings/modify/' + this.state.listing._id);
  }

  render() {
    let modifyButton = null;
    if (this.state.listing) {
      if (this.props.user._id === this.state.listing.assignedUser._id) {
        modifyButton = (<Button onClick={this.handleEditClicked} color='blue' icon='edit'>This listing is yours. Edit!</Button>)
      }
    }
    return (
      this.state.listing ? (
        <ListingContainer>
          <Flex>
            <Flex flexDirection='column' width={1} >
              <BookTitle>{this.state.listing.book.title}</BookTitle>
              <AuthorsList>{"By " + this.state.listing.book.authors.join(', ')}</AuthorsList>
              <Divider />
                <Flex flexDirection='row' width={1} alignItems="center">
                  <PhotosCarousel class="information" photos={this.state.photos}/>
                  <div class="information">
                  <Flex flexDirection='column' width={1} alignItems="center">
                    <Segment padded='very' compact className="segment">
                    <div class="price">Price: <Price> {this.state.listing.price ? `$${this.state.listing.price}` : '—'}</Price> </div>
                      <div class="price">Exchange for: <Price>{this.state.listing.exchangeBook ? this.state.listing.exchangeBook.title : '—'} </Price> </div>
                      <div class="price"> Condition: {this.state.listing.condition}</div>
                      <div class="price">Last updated: {moment(this.state.listing.dateCreated).format('MMMM DD, YYYY H:mm:ss ')}</div>
                      <div class="price">Listed by: {this.state.listing.assignedUser.displayName}</div>
                      {modifyButton}
                    </Segment>
                  </Flex>
                  </div>
                </Flex>
                <Isbn> ISBN: {this.state.listing.book.isbn}</Isbn>
                <div class="interested">
                <p>Interested in this listing?</p>
                  <Button>
                    <a class="link"
                      href={'mailto:'+
                            this.state.listing.assignedUser.email +
                            '?subject=UIUC TEXTBOOK EXCHANGE - Interested in your book '
                            + this.state.listing.book.title}>
                      {"Contact " + this.state.listing.assignedUser.displayName}
                    </a>
                  </Button>
                </div>
            </Flex>
          </Flex>
        </ListingContainer>
      ) : null
    );
  }
};

export default connect(state => state.loginState)(ListingDetails);
