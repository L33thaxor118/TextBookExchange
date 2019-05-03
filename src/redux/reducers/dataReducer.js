import { CREATE_LISTING, GET_LISTINGS, GET_BOOKS, CREATE_BOOK} from "../actions/types";


export function books(state = [], action) {
  switch (action.type) {
    case GET_BOOKS.SUCCESS:
      return action.books;
    case CREATE_BOOK.SUCCESS:
      return [...state, action.book];
    default:
      return state;
  }
}

export function createBookHasFailed(state = false, action) {
  switch (action.type) {
    case CREATE_BOOK.FAILURE:
      return action.error;
    default:
      return state;
  }
}

export function listings(state = [], action) {
  switch (action.type) {
    case GET_LISTINGS.SUCCESS:
      return action.listings;
    case CREATE_LISTING.SUCCESS:
      return [...state, action.listing];
    default:
      return state;
  }
}

export function getListingsHasFailed(state = false, action) {
  switch (action.type) {
    case GET_LISTINGS.FAILURE:
      return action.error;
    default:
      return state;
  }
}

export function createListingHasFailed(state = false, action) {
  switch (action.type) {
    case CREATE_LISTING.FAILURE:
      return action.error;
    default:
      return state;
  }
}
