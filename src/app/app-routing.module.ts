import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/welcome/welcome.module').then(m => m.WelcomePageModule)
  },
  {
    path: 'information-personnel',
    loadChildren: () => import('./pages/information-personnel/information-personnel.module').then(m => m.InformationPersonnelPageModule)
  },
  {
    path: 'type-de-reclamation',
    loadChildren: () => import('./pages/type-de-reclamation/type-de-reclamation.module').then(m => m.TypeDeReclamationPageModule)
  },
  {
    path: 'information-de-reclamation',
    loadChildren: () => import('./pages/information-de-reclamation/information-de-reclamation.module').then(m => m.InformationDeReclamationPageModule)
  },
  {
    path: 'all-claims',
    loadChildren: () => import('./pages/all-claims/all-claims.module').then(m => m.AllClaimsPageModule)
  },
  {
    path: 'about-us',
    loadChildren: () => import('./pages/about-us/about-us.module').then(m => m.AboutUsPageModule)
  },
  {
    path: 'single-claim-page',
    loadChildren: () => import('./pages/single-claim-page/single-claim-page.module').then( m => m.SingleClaimPagePageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
