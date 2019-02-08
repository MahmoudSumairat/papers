import { Action } from "@ngrx/store";
import { Book } from "./book.model";

export const SET_ALL_BOOKS = "SET_ALL_BOOKS";
export const SET_READ_BOOKS = "SET_READ_BOOKS";
export const SET_CURRENT_BOOKS = "SET_CURRENT_BOOKS";
export const SET_WANT_BOOKS = "SET_WANT_BOOKS";
export const SET_AUTHORS = "SET_AUTHORS";

export class SetAllBooks implements Action {
  readonly type = SET_ALL_BOOKS;
  constructor(public payload: Book[]) {}
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

export class SetAuthors implements Action {
  readonly type = SET_AUTHORS;
  constructor(public payload: Book[]) {}
}

export type BookActions =
  | SetAllBooks
  | SetReadBooks
  | SetCurrentBooks
  | SetWantBooks
  | SetAuthors
