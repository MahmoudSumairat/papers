import {
  BookDetailsActions,
  SET_STAR_REVIEWED,
  SET_STAR_NOT_REVIEWED,
  SET_READ_BOOKS,
  SET_CURRENT_BOOKS,
  SET_WANT_BOOKS
} from "./book-details.actions";
import { Book } from "../home/book.model";

export interface State {
  starReviewed: boolean;
  readBooks: Book[];
  currentBooks: Book[];
  wantBooks: Book[];
}

export const initialState: State = {
  starReviewed: false,
  readBooks: [],
  currentBooks: [],
  wantBooks: []
};

export function bookDetailsReducer(
  state = initialState,
  action: BookDetailsActions
) {
  switch (action.type) {
    case SET_STAR_REVIEWED:
      return {
        ...state,
        starReviewed: true
      };
    case SET_STAR_NOT_REVIEWED:
      return {
        ...state,
        starReviewed: false
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
    default:
      return state;
  }
}

export const getIsReviewed = (state: State) => state.starReviewed;
export const getReadBooks = (state: State) => state.readBooks;
export const getCurrentBooks = (state: State) => state.currentBooks;
export const getWantBooks = (state: State) => state.wantBooks;
