import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CestaComponent } from './pages/cesta/cesta.component';

const routes: Routes = [
  {
    path: '',
    component: CestaComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CestasRoutingModule {}
