import { SET_CURRENT_USER, CREATE_LISTING, GET_BOOKS, CREATE_BOOK, GET_LISTINGS} from "./types";
import axios from 'axios';
import booksApi from '../../api/books';
import listingsApi from '../../api/listings';



export function get_books() {
  return async (dispatch) => {
    try {
      let { books } = await booksApi.get();
      console.log(books);
      dispatch(get_books_success(books));
    } catch(err) {
      dispatch(get_books_failure(true));
    }
  };
}

export function get_books_success(books) {
  return {
    type: GET_BOOKS.SUCCESS,
    books
  };
}

export function get_books_failure(bool) {
  return {
    type: GET_BOOKS.FAILURE,
    hasErrored: bool
  };
}

export function post_book(newbook) {
  return async (dispatch) => {
    try {
      let { book } = await booksApi.create(newbook);
      console.log("successfuly created new book");
      console.log(book);
      dispatch(post_book_success(book));
      return book;
    } catch(err) {
      console.log(err);
      console.log("failed to create new book");
      dispatch(post_book_failure(true));
    }
  };
}

export function post_book_success(book) {
  return {
    type: CREATE_BOOK.SUCCESS,
    book
  };
}

export function post_book_failure(bool) {
  return {
    type: CREATE_BOOK.FAILURE,
    hasErrored: bool
  };
}



export function post_listing(listing) {
  return async (dispatch) => {
    try {
      let { newListing } = await listingsApi.create(listing);
      console.log("successfuly created new Listing");
      console.log(newListing);
      dispatch(post_listing_success(listing));
    } catch(err) {
      console.log(err);
      console.log("failed to create new Listing");
      dispatch(post_listing_failure(true));
    }
  };
}

export function post_listing_success(listing) {
  return {
    type: CREATE_LISTING.SUCCESS,
    listing
  };
}

export function post_listing_failure(bool) {
  return {
    type: CREATE_LISTING.FAILURE,
    hasErrored: bool
  };
}

export function get_listings() {
  return async (dispatch) => {
    try {
      let { listings } = await listingsApi.get();
      console.log(listings);
      dispatch(get_listings_success(listings));
    } catch(err) {
      dispatch(get_listings_failure(true));
    }
  };
}

export function get_listings_success(listings) {
  return {
    type: GET_LISTINGS.SUCCESS,
    listings
  };
}

export function get_listings_failure(bool) {
  return {
    type: GET_LISTINGS.FAILURE,
    hasErrored: bool
  };
}

//in component: dispatch an action
