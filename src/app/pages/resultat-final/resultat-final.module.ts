import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResultatFinalPageRoutingModule } from './resultat-final-routing.module';

import { ResultatFinalPage } from './resultat-final.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResultatFinalPageRoutingModule
  ],
  declarations: [ResultatFinalPage]
})
export class ResultatFinalPageModule {}
