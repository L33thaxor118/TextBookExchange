import { SET_CURRENT_USER, CREATE_LISTING, GET_BOOKS } from "./types";
import axios from 'axios';


export function get_books() {
  return (dispatch) => {
    axios.get('https://uofi-book-exchange-backend.herokuapp.com/books')
    .then(response=> {
      dispatch(get_books_success(response.data.books));
    }).catch(error=> {
      dispatch(get_books_failure(true));
    });
  };
}

export function create_book(book) {
  return (dispatch) => {
    axios.post('https://uofi-book-exchange-backend.herokuapp.com/books', book)
    .then(response=> {
      console.log(response);
      dispatch(post_book_success(response.data));
    }).catch(error=> {
      dispatch(post_book_failure(true));
    });
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

//in component: dispatch an action
