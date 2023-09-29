import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { QuoteComponent } from './quote/quote.component';
import { AdminComponent } from './admin/admin.component';
import { QuoteeditComponent } from './quoteedit/quoteedit.component';

const routes: Routes = [  
  { path: '', component: HomeComponent },
  {path: 'login', component: AboutComponent},
  {path: 'quote', component: QuoteComponent},
  {path: 'admindash', component: AdminComponent},
  {path: 'quoteedit', component: QuoteeditComponent}
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
