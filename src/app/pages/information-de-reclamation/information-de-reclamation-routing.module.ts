import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InformationDeReclamationPage } from './information-de-reclamation.page';

const routes: Routes = [
  {
    path: '',
    component: InformationDeReclamationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InformationDeReclamationPageRoutingModule {}
