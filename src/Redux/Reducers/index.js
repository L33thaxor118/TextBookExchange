import { combineReducers } from "redux";

import {booksSuccess, booksHasFailed } from "./dataReducer";

export default combineReducers({
  books: booksSuccess,
  booksError: booksHasFailed
});
