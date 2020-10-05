import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TypeDeReclamationPageRoutingModule } from './type-de-reclamation-routing.module';

import { TypeDeReclamationPage } from './type-de-reclamation.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    TypeDeReclamationPageRoutingModule
  ],
  declarations: [TypeDeReclamationPage],

})
export class TypeDeReclamationPageModule { }
