import { Author } from "./author.model";
import { AuthorsActions } from "./authors.actions";

export interface State {
  authors: Author[];
}

export const initalState: State = {
  authors: []
};

export function authorsReducer(state = initalState, action: AuthorsActions) {
  switch (action.type) {
    case "SET_AUTHORS":
      return {
        authors: action.payload
      };
    default:
      return state;
  }
}

export const getAuthors = (state: State) => state.authors;
