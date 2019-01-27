import { BookDetailsActions, SET_STAR_REVIEWED } from "./book-details.actions";

export interface State {
  starReviewed : boolean
}

export const initialState: State = {
 starReviewed : false
};

export function bookDetailsReducer(state = initialState, action : BookDetailsActions) {
  switch (action.type) {
    case SET_STAR_REVIEWED:
      return {
        ...state,
        starReviewed : true
      };
    default:
      return state;
  }
}

export const getIsReviewed = (state: State) => state.starReviewed;

