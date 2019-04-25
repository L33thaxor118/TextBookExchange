import React from 'react';
import moment from 'moment';
import { Image, Divider } from 'semantic-ui-react';
import { Flex } from '@rebass/grid';

import {
  ImageContainer,
  ListingContainer,
  AuthorsList,
  BookTitle,
} from './ListingDetails.styled';

import listingsApi from '../api/listings';

class ListingDetails extends React.Component {
  state = {
    listing: null,
  };

  async componentDidMount() {
    const { id } = this.props.match.params;
    const { listing } = await listingsApi.get({ id });
    this.setState({ listing });
  }

  render() {
    const { listing } = this.state;

    return (
      listing ? (
        <ListingContainer>
          <Flex>
            <ImageContainer>
              <Image
                src='https://compass-isbn-assets.s3.amazonaws.com/isbn_cover_images/9781285741550/9781285741550_largeCoverImage.gif'
                size='medium'
              /> 
            </ImageContainer>
            <Flex flexDirection='column' width={1}>
              <BookTitle>{listing.book.title}</BookTitle>
              <AuthorsList>{listing.book.authors.join(', ')}</AuthorsList>
              <Divider />
              <div>Listed by: {listing.assignedUser.displayName}</div>
              <div>Last updated: {moment(listing.dateCreated).format('MMMM DD, YYYY H:mm:ss ')}</div>
              <div>Condition: {listing.condition}</div>
              <div>Price: ${listing.price}</div>
              <div>Exchange for: {listing.exchangeBook ? listing.exchangeBook.title : '--'}</div>
            </Flex>
          </Flex>
        </ListingContainer>
      ) : null
    );
  }
};

export default ListingDetails;