import { combineReducers } from "redux";

import {books, getBooksHasFailed, createBookHasFailed, listings, getListingsHasFailed,
  createListingHasFailed} from "./dataReducer";

export default combineReducers({
  books,
  getBooksHasFailed,
  createBookHasFailed,

  listings,
  getListingsHasFailed,
  createListingHasFailed
});
