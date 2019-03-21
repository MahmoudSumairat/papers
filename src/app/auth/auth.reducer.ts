import { Action } from '@ngrx/store';
import {
  SET_AUTHENTICATED,
  AuthActions,
  SET_UNAUTHENTICATED,
  SET_USERS
} from './auth.actions';
import { UserData } from './user.model';

export interface State {
  isAuthenticated: boolean;
  users : UserData[];
}

export const initialState: State = {
  isAuthenticated: false,
  users : []
};

export function authReducer(state = initialState, action: AuthActions) {
  switch (action.type) {
    case SET_AUTHENTICATED:
      return {
        ...state,
        isAuthenticated: true
      };
    case SET_UNAUTHENTICATED:
      return {
        ...state,
        isAuthenticated: false
      };
    case SET_USERS: 
    return {
      ...state,
      users : action.payload
    };
    default:
      return state;
  }
}

export const getIsAuth = (state: State) => state.isAuthenticated;
export const getAuthUsers = (state: State) => state.users;
