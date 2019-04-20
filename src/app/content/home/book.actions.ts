import { Action } from "@ngrx/store";
import { Book } from "./book.model";

export const SET_ALL_BOOKS = "SET_ALL_BOOKS"; // TRIGGERS WHEN THE BOOKS ARE FETCHED FROM THE DATABASE
export const SET_AUTHORS = "SET_AUTHORS"; // TRIGGERS WHEN THE AUTHORS ARE FETCHED FROM THE DATABASE

export class SetAllBooks implements Action {
  readonly type = SET_ALL_BOOKS;
  constructor(public payload: Book[]) {}
}

export class SetAuthors implements Action {
  readonly type = SET_AUTHORS;
  constructor(public payload: Book[]) {}
}

export type BookActions = SetAllBooks | SetAuthors;
