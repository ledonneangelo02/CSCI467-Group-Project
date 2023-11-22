import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { QuoteComponent } from './quote/quote.component';
import { AdminComponent } from './admin/admin.component';
import { ViewquotesComponent } from './viewquotes/viewquotes.component';
import { QuoteeditComponent } from './quoteedit/quoteedit.component';
import { NavbarComponent } from './nav-bar/nav-bar.component';
import { PocreateComponent } from './pocreate/pocreate.component';

const routes: Routes = [  
  { path: '', component: HomeComponent },
  {path: 'quote', component: QuoteComponent},
  {path: 'admindash', component: AdminComponent},
  {path: 'viewquotes', component: ViewquotesComponent},
  {path: 'quoteedit', component: QuoteeditComponent},
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
