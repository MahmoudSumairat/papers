import { Action } from "@ngrx/store";
import { Book } from "./book.model";

export const SET_ALL_BOOKS = "SET_ALL_BOOKS";
export const SET_AUTHORS = "SET_AUTHORS";

export class SetAllBooks implements Action {
  readonly type = SET_ALL_BOOKS;
  constructor(public payload: Book[]) {}
}


export class SetAuthors implements Action {
  readonly type = SET_AUTHORS;
  constructor(public payload: Book[]) {}
}

export type BookActions =SetAllBooks
  | SetAuthors
