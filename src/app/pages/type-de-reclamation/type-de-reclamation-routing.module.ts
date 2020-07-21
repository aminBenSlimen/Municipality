import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TypeDeReclamationPage } from './type-de-reclamation.page';

const routes: Routes = [
  {
    path: '',
    component: TypeDeReclamationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TypeDeReclamationPageRoutingModule {}
