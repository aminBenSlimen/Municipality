import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InformationPersonnelPage } from './information-personnel.page';

const routes: Routes = [
  {
    path: '',
    component: InformationPersonnelPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InformationPersonnelPageRoutingModule {}
