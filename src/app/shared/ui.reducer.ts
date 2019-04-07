import { uiActions, START_LOADING, STOP_LOADING, SHOW_PROFILE_BOX, HIDE_PROFILE_BOX, SHOW_TRY_AGAIN, HIDE_TRY_AGAIN } from './ui.actions';

export interface State {
    isLoading : boolean;
    showProfileBox : boolean;
    showTryAgain : boolean;
}

export const initialState : State =  {
    isLoading : false,
    showProfileBox : false,
    showTryAgain : false
}


export function uiReducer(state = initialState, action : uiActions) {
    switch(action.type) {
        case START_LOADING:
        return {
            ...state,
            isLoading : true
        }
        case STOP_LOADING:
        return {
            ...state,
            isLoading : false
        }
        case SHOW_PROFILE_BOX:
         return  {
            ...state,
            showProfileBox : true
        }
        case HIDE_PROFILE_BOX:
        return {
            ...state,
            showProfileBox : false
        }
        case SHOW_TRY_AGAIN :
        return {
            ...state,
            showTryAgain : true
        }
        case HIDE_TRY_AGAIN:
        return {
            ...state,
            showTryAgain  : false
        }
        default : {
            return state
        }
    }
}


export const getIsLoading = (state : State) => state.isLoading;
export const getShow = (state : State) => state.showProfileBox;
export const getTry = (state : State) => state.showTryAgain;