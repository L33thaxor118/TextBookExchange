import { CREATE_LISTING, GET_BOOKS, CREATE_BOOK, GET_LISTINGS } from "./types";
import booksApi from '../../api/books';
import listingsApi from '../../api/listings';

const generateApiCreator = (ACTION_OBJ, start) => ({
  start: (...args) => async dispatch => start(dispatch, ...args),
  success: successObj => ({
    type: ACTION_OBJ.SUCCESS,
    ...successObj,
  }),
  fail: error => ({
    type: ACTION_OBJ.FAILURE,
    error
  }),
});

export const getBooks = generateApiCreator(GET_BOOKS, async dispatch => {
  try {
    let { books } = await booksApi.get();
    dispatch(getBooks.success({ books }));
  } catch(err) {
    dispatch(getBooks.fail(err));
  }
});

export const createBook = generateApiCreator(CREATE_BOOK, async (dispatch, newBook) => {
  try {
    const { book } = await booksApi.create(newBook);
    dispatch(createBook.success({ book }));
    return book;
  } catch (err) {
    dispatch(createBook.fail(err));
  }
});

export const createListing = generateApiCreator(CREATE_LISTING, async (dispatch, listing) => {
  try {
    const { listing: createdListing } = await listingsApi.create(listing);
    dispatch(createListing.success({ listing: createdListing }));
    return createdListing;
  } catch (err) {
    dispatch(createListing.fail(err));
  }
});

export const getListings = generateApiCreator(GET_LISTINGS, async dispatch => {
  try {
    let { listings } = await listingsApi.get();
    dispatch(getListings.success({ listings }));
  } catch (err) {
    dispatch(getListings.fail(err));
  }
});