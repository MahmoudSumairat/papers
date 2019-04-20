import { Action } from "@ngrx/store";
import { Book } from "../home/book.model";

export const SET_STAR_REVIEWED = "SET_STAR_REVIEWED"; // TRIGGERS WHEN THE USER HAS RATED THE BOOK OR THE AUTHOR
export const SET_STAR_NOT_REVIEWED = "SET_STAR_NOT_REVIEWED"; // TRIGGERS WHEN THE BOOK COMPONETN IS DESTROYED
export const SET_READ_BOOKS = "SET_READ_BOOKS"; // TRIGGERS WHEN THE READ BOOKS OF THE USER ARE FETCHED FROM THE DATABASE
export const SET_CURRENT_BOOKS = "SET_CURRENT_BOOKS"; // TRIGGERS WHEN THE CURRENTLY READING BOOKS ARE FETCHED FROM THE DATABASE
export const SET_WANT_BOOKS = "SET_WANT_BOOKS"; // TRIGGERS WHEN THE WANT TO READ BOOKS ARE FETCHED FROM THE DATABASE

export class SetStarReviewed implements Action {
  readonly type = SET_STAR_REVIEWED;
  constructor() {}
}

export class SetStarNotReviewed implements Action {
  readonly type = SET_STAR_NOT_REVIEWED;
  constructor() {}
}

export class SetReadBooks implements Action {
  readonly type = SET_READ_BOOKS;
  constructor(public payload: Book[]) {}
}

export class SetCurrentBooks implements Action {
  readonly type = SET_CURRENT_BOOKS;
  constructor(public payload: Book[]) {}
}

export class SetWantBooks implements Action {
  readonly type = SET_WANT_BOOKS;
  constructor(public payload: Book[]) {}
}

export type BookDetailsActions =
  | SetStarReviewed
  | SetStarNotReviewed
  | SetReadBooks
  | SetCurrentBooks
  | SetWantBooks;
