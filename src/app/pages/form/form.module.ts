import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormComponent } from './form.component';
import { FormRoutingModule } from './form-routing.module';

import { NzButtonModule } from 'ng-zorro-antd/button';

@NgModule({
  imports: [
    CommonModule,
    FormRoutingModule,
    NzButtonModule
  ],
  declarations: [FormComponent],
  exports: [FormComponent]
})
export class FormModule { }
