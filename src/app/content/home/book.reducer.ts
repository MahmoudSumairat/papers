import { Book } from "./book.model";
import {
  BookActions,
  SET_ALL_BOOKS,
  SET_AUTHORS
} from "./book.actions";

export interface State {
  allBooks: Book[];
  authors : any[]
}

export const initialState: State = {
  allBooks: [],
  authors : []
};

export function bookReducer(state = initialState, action: BookActions) {
  switch (action.type) {
    case SET_ALL_BOOKS:
      return {
        ...state,
        allBooks: action.payload
      };

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
export const getAuthors = (state: State) => state.authors;
