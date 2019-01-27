import {
  ActionReducerMap,
  createFeatureSelector,
  createSelector
} from "@ngrx/store";

import * as fromBook from "./content/home/book.reducer";
import * as fromAuth from "./auth/auth.reducer";
import * as fromBookDetails from "./content/book-details/book-details.reducer";

export interface State {
  auth: fromAuth.State;
  book: fromBook.State;
  bookDetails : fromBookDetails.State
}

export const reducers: ActionReducerMap<State> = {
  auth: fromAuth.authReducer,
  book: fromBook.authReducer,
  bookDetails : fromBookDetails.bookDetailsReducer
};


//For auth reducer
export const getAuthState = createFeatureSelector<fromAuth.State>("auth");
export const getIsAuth = createSelector(
  getAuthState,
  fromAuth.getIsAuth
);

//For book reducer
export const getBookState = createFeatureSelector<fromBook.State>("book");
export const getAllBooks = createSelector(
  getBookState,
  fromBook.getAllBooks
);
export const getReadBooks = createSelector(
  getBookState,
  fromBook.getReadBooks
);
export const getCurrentBooks = createSelector(
  getBookState,
  fromBook.getCurrentBooks
);
export const getWantBooks = createSelector(
  getBookState,
  fromBook.getWantBooks
);


//For bookDetails reducer
export const getBookDetailsState = createFeatureSelector<fromBookDetails.State>("bookDetails");
export const getIsReviewed = createSelector(getBookDetailsState, fromBookDetails.getIsReviewed);
