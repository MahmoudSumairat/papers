import { Book } from "./book.model";
import {
  BookActions,
  SET_ALL_BOOKS,
  SET_READ_BOOKS,
  SET_CURRENT_BOOKS,
  SET_WANT_BOOKS,
  SET_AUTHORS
} from "./book.actions";

export interface State {
  allBooks: Book[];
  readBooks: Book[];
  currentBooks: Book[];
  wantBooks: Book[];
  authors : any[]
}

export const initialState: State = {
  allBooks: [],
  readBooks: [],
  currentBooks: [],
  wantBooks: [],
  authors : []
};

export function bookReducer(state = initialState, action: BookActions) {
  switch (action.type) {
    case SET_ALL_BOOKS:
      return {
        ...state,
        allBooks: action.payload
      };
    case SET_READ_BOOKS:
      return {
        ...state,
        readBooks: action.payload
      };
    case SET_CURRENT_BOOKS: {
      return {
        ...state,
        currentBooks: action.payload
      };
    }
    case SET_WANT_BOOKS: {
      return {
        ...state,
        wantBooks: action.payload
      };
    }
    case SET_AUTHORS: {
      return {
        ...state,
        authors: action.payload
      };
    }
    default:
      return state;
  }
}

export const getAllBooks = (state: State) => state.allBooks;
export const getReadBooks = (state: State) => state.readBooks;
export const getCurrentBooks = (state: State) => state.currentBooks;
export const getWantBooks = (state: State) => state.wantBooks;
export const getAuthors = (state: State) => state.authors;
