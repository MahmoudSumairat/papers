import { Action } from "@ngrx/store";
import { Author } from "./author.model";

export const SET_AUTHORS = "SET_AUTHORS"; // TRIGGERS WHEN THE USERS ARE FETCHED FROM THE DATABASE

export class SetAuthors implements Action {
  readonly type = SET_AUTHORS;
  constructor(public payload: Author[]) {}
}

export type AuthorsActions = SetAuthors;
