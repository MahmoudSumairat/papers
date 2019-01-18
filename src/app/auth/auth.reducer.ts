import { Action } from "@ngrx/store";
import { SET_AUTHENTICATED, AuthActions, SET_UNAUTHENTICATED } from './auth.actions';

export interface State {
    isAuthenticated : boolean
}

export const initialState : State = {
   isAuthenticated : false
}

export function authReducer (state  = initialState, action : AuthActions) {
    switch(action.type) {
        case SET_AUTHENTICATED:
        return {
            
            isAuthenticated : true
            
        }
        case SET_UNAUTHENTICATED :
        return {
           isAuthenticated : false
        }
        default:
        return state;
    }
}

export const getIsAuth = (state : State) => state.isAuthenticated;
