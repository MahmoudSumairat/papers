import { Action } from "@ngrx/store";
import { UserData } from './user.model';

export const SET_AUTHENTICATED = 'SET_AUTHENTICATED';
export const SET_UNAUTHENTICATED = 'SET_UNAUTHENTICATED';
export const SET_USERS = 'SET_USERS';

export class SetAuthenticated implements Action {
    readonly type = SET_AUTHENTICATED;
    
}

export class SetUnauthenticated implements Action {
    readonly type = SET_UNAUTHENTICATED
    
}

export class SetUsers implements Action {
    readonly type = SET_USERS;
    constructor(public payload : UserData[]) {}
}



export type AuthActions = SetAuthenticated | SetUnauthenticated | SetUsers;