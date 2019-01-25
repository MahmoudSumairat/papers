import {
  ActionReducerMap,
  createFeatureSelector,
  createSelector
} from "@ngrx/store";

import * as fromBook from "./content/home/book.reducer";
import * as fromAuth from "./auth/auth.reducer";

export interface State {
  auth: fromAuth.State;
  book: fromBook.State;
}

export const reducers: ActionReducerMap<State> = {
  auth: fromAuth.authReducer,
  book: fromBook.authReducer
};

export const getAuthState = createFeatureSelector<fromAuth.State>("auth");
export const getIsAuth = createSelector(
  getAuthState,
  fromAuth.getIsAuth
);

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
