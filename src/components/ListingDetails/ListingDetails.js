import React from 'react';
import moment from 'moment';
import { Divider, Segment } from 'semantic-ui-react';
import { Flex } from '@rebass/grid';
import PhotosCarousel from './PhotosCarousel/PhotosCarousel';
import './ListingDetails.scss'
import { fetchPhotoUrls } from '../../utils/firebase';

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
  }

  async componentDidMount() {
    const { id } = this.props.match.params;
    const { listing } = await listingsApi.get({ id });
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

  render() {
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
                    </Segment>
                  </Flex>
                  </div>
                </Flex>
                <Isbn> ISBN: {this.state.listing.book.isbn}</Isbn>
                <div class="interested"> Interested in {this.state.listing.assignedUser.displayName}'s listing?
                 <a class="link" href={'mailto:'+ this.state.listing.assignedUser.email + '?subject=UIUC TEXTBOOK EXCHANGE - Interested in your book '+ this.state.listing.book.title}>Contact them !</a>
                </div>
            </Flex>
          </Flex>
        </ListingContainer>
      ) : null
    );
  }
};

export default ListingDetails;