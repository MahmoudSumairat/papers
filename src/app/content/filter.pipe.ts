import { Pipe, PipeTransform } from '@angular/core';
import { Router } from '@angular/router';
import { Book } from './home/book.model';
import { Author } from './authors/author.model';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  constructor(private router : Router) {}

  transform(value: any[], searchValue: string): any {
    if(!searchValue) {
      return value;
    } 
    
    if(this.router.url === '/content') {
          return  value.filter((book : Book) => {
            const genres = book.genres.map(genre => genre.toLowerCase());
            return book.bookName.toLowerCase().indexOf(searchValue.toLowerCase()) > -1 || book.authorName.toLowerCase().indexOf(searchValue.toLowerCase()) > -1 
            || genres.indexOf(searchValue.toLowerCase()) > -1;
          })
          

      } else if (this.router.url === '/content/authors') {
        return  value.filter((author : Author) => {
          return author.name.toLowerCase().indexOf(searchValue.toLowerCase()) > -1;
        })
    

      } else if(this.router.url === '/content/quotes') {
        return value.filter((quote) => {
          return quote.name.toLowerCase().indexOf(searchValue.toLowerCase()) > -1 || quote.quote.toLowerCase().indexOf(searchValue.toLowerCase()) > -1;
        }) 
      
      } 
   


  }

}
