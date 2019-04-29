import { combineReducers } from "redux";

import {
  books,
  createBookHasFailed,
  listings,
  getListingsHasFailed,
  createListingHasFailed
} from "./dataReducer";

import loginState from './userReducer';

export default combineReducers({
  books,
  createBookHasFailed,
  listings,
  getListingsHasFailed,
  createListingHasFailed,
  loginState,
});
