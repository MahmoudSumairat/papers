import { NgModule } from "@angular/core";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { AuthorDetailsComponent } from './author-details/author-details.component';

@NgModule({
  imports: [AngularFirestoreModule],
})
export class ContentModule {}
