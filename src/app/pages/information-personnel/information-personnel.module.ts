import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InformationPersonnelPageRoutingModule } from './information-personnel-routing.module';

import { InformationPersonnelPage } from './information-personnel.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    IonicModule,
    InformationPersonnelPageRoutingModule
  ],
  declarations: [InformationPersonnelPage]
})
export class InformationPersonnelPageModule { }
