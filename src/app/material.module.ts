import { NgModule } from "@angular/core";
import { MatIconModule,
         MatFormFieldModule,
         MatDatepickerModule,
         MatNativeDateModule,
         MatInputModule
         
} from "@angular/material";

@NgModule({
  imports: [MatIconModule,
            MatFormFieldModule,
            MatDatepickerModule,
            MatNativeDateModule,
            MatInputModule
            ],
  exports: [MatIconModule,
            MatFormFieldModule,
            MatDatepickerModule,
            MatNativeDateModule,
            MatInputModule
  ]
})
export class MaterialModule {}
