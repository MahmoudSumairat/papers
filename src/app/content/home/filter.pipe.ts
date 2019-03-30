import { Pipe, PipeTransform } from '@angular/core';
import { Book } from './book.model';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(value: any, searchValue: any): any {
      if(!searchValue) {
        return value;
      } else {
        const filterdArr =  value.filter((book : Book) => {
          return book.bookName.toLowerCase().indexOf(searchValue.toLowerCase()) > -1;
        })
        if(filterdArr[0]) {
          return filterdArr;
        } else {
          return value.filter((book : Book) => {
            return book.authorName.toLowerCase().indexOf(searchValue.toLowerCase()) > -1;
          })
        }
      }


  }

}
