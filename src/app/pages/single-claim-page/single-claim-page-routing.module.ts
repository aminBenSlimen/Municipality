import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SingleClaimPagePage } from './single-claim-page.page';

const routes: Routes = [
  {
    path: '',
    component: SingleClaimPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SingleClaimPagePageRoutingModule { }
