import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SingleClaimPagePageRoutingModule } from './single-claim-page-routing.module';

import { SingleClaimPagePage } from './single-claim-page.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SingleClaimPagePageRoutingModule
  ],
  declarations: [SingleClaimPagePage]
})
export class SingleClaimPagePageModule { }
