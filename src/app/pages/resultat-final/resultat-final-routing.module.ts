import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResultatFinalPage } from './resultat-final.page';

const routes: Routes = [
  {
    path: '',
    component: ResultatFinalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResultatFinalPageRoutingModule {}
