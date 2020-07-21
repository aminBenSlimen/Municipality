import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InformationPersonnelPageRoutingModule } from './information-personnel-routing.module';

import { InformationPersonnelPage } from './information-personnel.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InformationPersonnelPageRoutingModule
  ],
  declarations: [InformationPersonnelPage]
})
export class InformationPersonnelPageModule { }
