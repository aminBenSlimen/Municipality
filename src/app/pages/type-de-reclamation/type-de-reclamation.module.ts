import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TypeDeReclamationPageRoutingModule } from './type-de-reclamation-routing.module';

import { TypeDeReclamationPage } from './type-de-reclamation.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TypeDeReclamationPageRoutingModule
  ],
  declarations: [TypeDeReclamationPage],

})
export class TypeDeReclamationPageModule { }
