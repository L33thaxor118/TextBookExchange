import { SET_CURRENT_USER, CREATE_LISTING, GET_BOOKS } from "../Actions/types";

export function booksHasFailed(state = false, action) {
  switch (action.type) {
    case GET_BOOKS.FAILURE:
      return action.hasErrored;

    default:
      return state;
  }
}

export function booksSuccess(state = [], action) {
  switch (action.type) {
    case GET_BOOKS.SUCCESS:
      return action.books;

    default:
      return state;
  }
}
