import { Action } from "@ngrx/store";

export const SET_QUOTES = "SET_QUOTES"; // TRIGGERS WHEN THE QUOTES ARE FETCHED FROM THE DATABASE

export class SetQuotes implements Action {
  readonly type = SET_QUOTES;

  constructor(public payload: { quote: string; name: string }[]) {}
}

export type QuotesActions = SetQuotes;
