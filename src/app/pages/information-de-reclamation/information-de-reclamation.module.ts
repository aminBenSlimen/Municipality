import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InformationDeReclamationPageRoutingModule } from './information-de-reclamation-routing.module';

import { InformationDeReclamationPage } from './information-de-reclamation.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    IonicModule,
    InformationDeReclamationPageRoutingModule
  ],
  declarations: [InformationDeReclamationPage]
})
export class InformationDeReclamationPageModule { }
