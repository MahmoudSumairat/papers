import { NgModule } from "@angular/core";
import { MatIconModule,
         MatFormFieldModule,
         MatDatepickerModule,
         MatNativeDateModule,
         MatInputModule,
         MatSnackBarModule
         
} from "@angular/material";

@NgModule({
  imports: [MatIconModule,
            MatFormFieldModule,
            MatDatepickerModule,
            MatNativeDateModule,
            MatInputModule,
            MatSnackBarModule
            ],
  exports: [MatIconModule,
            MatFormFieldModule,
            MatDatepickerModule,
            MatNativeDateModule,
            MatInputModule,
            MatSnackBarModule
  ]
})
export class MaterialModule {}
