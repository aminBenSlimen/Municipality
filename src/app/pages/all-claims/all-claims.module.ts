import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { AnimatedLikeComponent } from 'src/app/components/animated-like/animated-like.component';

import { AllClaimsPageRoutingModule } from './all-claims-routing.module';

import { AllClaimsPage } from './all-claims.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    AllClaimsPageRoutingModule
  ],
  declarations: [AllClaimsPage, AnimatedLikeComponent]
})
export class AllClaimsPageModule { }
