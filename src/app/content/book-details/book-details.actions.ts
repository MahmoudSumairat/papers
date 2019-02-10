import { Action } from "@ngrx/store";
import { Book } from '../home/book.model';

export const SET_STAR_REVIEWED = "SET_STAR_REVIEWED";
export const SET_STAR_NOT_REVIEWED = "SET_STAR_NOT_REVIEWED";
export const SET_READ_BOOKS = "SET_READ_BOOKS";
export const SET_CURRENT_BOOKS = "SET_CURRENT_BOOKS";
export const SET_WANT_BOOKS = "SET_WANT_BOOKS";

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

export type BookDetailsActions =  SetStarReviewed | SetStarNotReviewed | SetReadBooks | SetCurrentBooks | SetWantBooks
