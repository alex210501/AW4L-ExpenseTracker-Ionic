import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { ExpenseDetailComponent } from './components/expense-details/expense-details.component';
import { LoginComponent } from './components/login/login.component';
import { SpacesComponent } from './components/spaces/spaces.component';
import { UserSpaceComponent } from './components/user-space/user-space.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full'},
  { path: 'login', component: LoginComponent},
  { path: 'spaces', component: SpacesComponent},
  { path: 'space/:space_id', component: UserSpaceComponent },
  { path: 'space/:space_id/expense/:expense_id', component: ExpenseDetailComponent },
  {
    path: 'folder/:id',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
