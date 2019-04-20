import { QuotesActions, SET_QUOTES } from "./quotes.actions";

export interface State {
  quotes: { name: string; quote: string }[];
}

export const initialState: State = {
  quotes: []
};

export function quotesReducer(state = initialState, action: QuotesActions) {
  switch (action.type) {
    case SET_QUOTES:
      return {
        quotes: action.payload
      };
    default:
      return state;
  }
}

export const getQuotes = (state: State) => state.quotes;
