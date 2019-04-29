import { combineReducers } from "redux";

import {books, createBookHasFailed, listings, getListingsHasFailed,
  createListingHasFailed} from "./dataReducer";

export default combineReducers({
  books,
  createBookHasFailed,

  listings,
  getListingsHasFailed,
  createListingHasFailed
});
