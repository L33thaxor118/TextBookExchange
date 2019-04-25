import { combineReducers } from "redux";

import {books, getBooksHasFailed, createBookHasFailed, listings, getListingsHasFailed,
  createListingHasFailed, createTradeBookHasFailed} from "./dataReducer";

export default combineReducers({
  books,
  getBooksHasFailed,
  createBookHasFailed,

  listings,
  getListingsHasFailed,
  createListingHasFailed
});
