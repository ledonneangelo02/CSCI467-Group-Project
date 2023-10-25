import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { QuoteComponent } from './quote/quote.component';
import { AdminComponent } from './admin/admin.component';
import { PocreateComponent } from './pocreate/pocreate.component';

const routes: Routes = [  
  { path: '', component: HomeComponent },
  {path: 'about', component: AboutComponent},
  {path: 'quote', component: QuoteComponent},
  {path: 'admindash', component: AdminComponent},
  {path: 'pocreate', component: PocreateComponent}
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
