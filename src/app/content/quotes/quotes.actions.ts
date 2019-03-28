import { Action } from '@ngrx/store';

export const SET_QUOTES = 'SET_QUOTES';

export class SetQuotes implements Action {
    readonly type = SET_QUOTES;

    constructor(public payload : {quote : string, name : string}[]) {}
}

export type QuotesActions = SetQuotes;