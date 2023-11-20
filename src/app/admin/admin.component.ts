import { Component, ElementRef, Renderer2, ViewChild, OnInit } from '@angular/core';
import { Router, NavigationEnd,ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  constructor(private http: HttpClient, private router: Router) { }
  assoc: any[]=[];
  quote: any[]=[];
  SalesAssoc: any;
  newAssociate: any = {};
  EmpName: any;
  add: any;
  savedAssoc: any;
  isAddAssocModal: boolean = false;
  test: any="Alan";
  Password: string= "password";
  Name: string = "Name";
  SalesCommision: string = "SalesCommision";
  Address: string="Address";
  ngOnInit () {
//private quoteUrl = 'https://phpapicsci467.azurewebsites.net/php_script/FinalizeQuote.php';

    this.http.get('https://phpapicsci467.azurewebsites.net/php_script/AssociateTable.php').subscribe((response:any) => {
      this.assoc= response;
      console.log(this.assoc);
    });
  
  this.http.get('https://phpapicsci467.azurewebsites.net/php_script/QuoteTable.php').subscribe((response:any) => {
    this.quote = response;
    console.log(this.quote);
  });
  }
  addAssociateModal(): void {
this.isAddAssocModal = true;
  }
  closeAddAssocModal(): void {
    this.isAddAssocModal = false;
  }
  addAssoc(event:Event): void {
    this.http.get('https://phpapicsci467.azurewebsites.net/php_script/AddAssociate.php').subscribe((response:any)=> {
    this.add = response;
    console.log(this.add);
    });
  }
  editAssoc(): void {

  }
  delAssoc(): void {

  }
  searchAssoc(): void {

  }
  viewAssoc(): void {

  }
  searchQuote (): void {

  }
  viewQuote(): void {

  }
Datacheck(): void
  {
    //Stored Associate Name
    var AssocName = localStorage.getItem('AssocName');
    if(AssocName !== null){
      this.EmpName = JSON.parse(AssocName);
    }
    //Stored Associate ID
    var savedAssoc = localStorage.getItem('CurrentAssoc');
    if(savedAssoc !== null){
      this.savedAssoc = JSON.parse(savedAssoc);
      console.log(savedAssoc);
    }else{
      this.router.navigateByUrl('/');
      setTimeout(function(){
        alert("Error: User not found, please Login");
      }, 200);
    }
  }

}