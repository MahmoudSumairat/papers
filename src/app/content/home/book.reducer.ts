import { Action } from "@ngrx/store";
import { Book } from './book.model';
import { BookActions, SET_ALL_BOOKS, SET_READ_BOOKS, SET_CURRENT_BOOKS, SET_WANT_BOOKS } from './book.actions';

export interface State {
    allBooks : Book[],
    readBooks : Book[],
    currentBooks : Book[],
    wantBooks : Book[]
}

export const initialState : State = {
   allBooks : [],
   readBooks : [],
   currentBooks : [],
   wantBooks : []
}

export function authReducer (state  = initialState, action : BookActions) {
    switch(action.type) {
        case SET_ALL_BOOKS:
        return {
            ...state,
            allBooks : action.payload
        }
        case SET_READ_BOOKS :
        return {
            ...state,
            readBooks : action.payload
        }
        case SET_CURRENT_BOOKS:
        {
            return {
                ...state,
                currentBooks : action.payload
            }
        }
        case SET_WANT_BOOKS :
        {
            return {
                ...state,
                wantBooks : action.payload
            }
        }
        default:
        return state;
    }
}

export const getAllBooks = (state : State) => state.allBooks;
export const getReadBooks = (state : State) => state.readBooks;
export const getCurrentBooks = (state : State) => state.currentBooks;
export const getWantBooks = (state : State) => state.wantBooks;