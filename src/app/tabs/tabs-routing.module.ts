import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'type-de-reclamation',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../pages/type-de-reclamation/type-de-reclamation.module').then(m => m.TypeDeReclamationPageModule)
          }
        ]
      },
      {
        path: 'information-personnel',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../pages/information-personnel/information-personnel.module').then(m => m.InformationPersonnelPageModule)
          }
        ]
      },
      {
        path: 'information-de-reclamation',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../pages/information-de-reclamation/information-de-reclamation.module').then(m => m.InformationDeReclamationPageModule)
          }
        ]
      },
      {
        path: 'resultat-final',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../pages/resultat-final/resultat-final.module').then(m => m.ResultatFinalPageModule)
          }
        ]
      },
      {
        path: 'tabs',
        redirectTo: '/tabs/information-personnel',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/welcome',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule { }
