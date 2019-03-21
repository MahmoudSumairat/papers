import {
  ActionReducerMap,
  createFeatureSelector,
  createSelector
} from "@ngrx/store";

import * as fromBook from "./content/home/book.reducer";
import * as fromAuth from "./auth/auth.reducer";
import * as fromBookDetails from "./content/book-details/book-details.reducer";
import * as fromAuthors from "./content/authors/authors.reducer";

export interface State {
  auth : fromAuth.State,
  book: fromBook.State;
  bookDetails : fromBookDetails.State;
  authors : fromAuthors.State
}

export const reducers: ActionReducerMap<State> = {
  auth : fromAuth.authReducer,
  bookDetails : fromBookDetails.bookDetailsReducer,
  book: fromBook.bookReducer,
  authors : fromAuthors.authorsReducer,

};


//For auth reducer
export const getAuthState = createFeatureSelector<fromAuth.State>("auth");
export const getIsAuth = createSelector(
  getAuthState,
  fromAuth.getIsAuth
);
export const getAuthUsers = createSelector(getAuthState, fromAuth.getAuthUsers);

//For book reducer
export const getBookState = createFeatureSelector<fromBook.State>("book");
export const getAllBooks = createSelector(
  getBookState,
  fromBook.getAllBooks
);

export const getAuthors = createSelector(
  getBookState,
  fromBook.getAuthors
);


//For bookDetails reducer
export const getBookDetailsState = createFeatureSelector<fromBookDetails.State>("bookDetails");
export const getIsReviewed = createSelector(getBookDetailsState, fromBookDetails.getIsReviewed);
export const getReadBooks = createSelector(
  getBookDetailsState,
  fromBookDetails.getReadBooks
);
export const getCurrentBooks = createSelector(
  getBookDetailsState,
  fromBookDetails.getCurrentBooks
);
export const getWantBooks = createSelector(
  getBookDetailsState,
  fromBookDetails.getWantBooks
);


//For Authors reducer
export const getAuthorsState = createFeatureSelector<fromAuthors.State>('authors');
export const getAllAuthors = createSelector(getAuthorsState, fromAuthors.getAuthors);