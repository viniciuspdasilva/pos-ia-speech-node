import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {IndexComponent} from './componentes/index/index.component';
import {RespostaComponent} from './componentes/resposta/resposta.component';


const routes: Routes = [
  {path: '', component: IndexComponent},
  {path: 'resposta', component: RespostaComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
