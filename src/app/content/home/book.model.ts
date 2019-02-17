import { Timestamp } from 'rxjs';

export interface Book {
  bookName: string;
  authorName: string;
  brief: string;
  img: string;
  avgRating : number;
  dateAdded : any;
  dateRead? : any;
}
