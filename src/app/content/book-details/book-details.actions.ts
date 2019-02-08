import { Action } from "@ngrx/store";

export const SET_STAR_REVIEWED = "SET_STAR_REVIEWED";
export const SET_STAR_NOT_REVIEWED = "SET_STAR_NOT_REVIEWED";


export class SetStarReviewed implements Action {
  readonly type = SET_STAR_REVIEWED;
  constructor() {}
}

export class SetStarNotReviewed implements Action {
  readonly type = SET_STAR_NOT_REVIEWED;
  constructor() {}
}

export type BookDetailsActions =  SetStarReviewed | SetStarNotReviewed;
