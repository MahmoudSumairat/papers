import { Action } from '@ngrx/store';

export const START_LOADING = 'START_LOADING';
export const STOP_LOADING = 'STOP_LOADING';
export const SHOW_PROFILE_BOX = 'SHOW_PROFILE_BOX';
export const HIDE_PROFILE_BOX = 'HIDE_PROFILE_BOX';
export const SHOW_TRY_AGAIN = 'SHOW_TRY_AGAIN';
export const HIDE_TRY_AGAIN = 'HIDE_TRY_AGAIN';


export class StartLoading implements Action {
    readonly type = START_LOADING;
}


export class StopLoading implements Action {
    readonly type = STOP_LOADING
}

export class ShowProfileBox implements Action {
    readonly type = SHOW_PROFILE_BOX
}

export class HideProfileBox implements Action {
    readonly type = HIDE_PROFILE_BOX
}

export class ShowTryAgain implements Action {
    readonly type = SHOW_TRY_AGAIN
}

export class HideTryAgain implements Action {
    readonly type = HIDE_TRY_AGAIN
}

export type uiActions = StartLoading | StopLoading | ShowProfileBox | HideProfileBox | ShowTryAgain | HideTryAgain;