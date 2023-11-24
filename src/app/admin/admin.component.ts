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
  saveEditedAssoc: any;
  isAddAssocModal: boolean = false;
  ID: string= "";
  Password: string= "";
  Name: string = "";
  SalesCommision: string = "";
  Address: string="";
  searchTerm: string = "";
  searchTerm2: string="";
  selectedAssoc: any;
  selectedAssocForEdit: any ={};
  isEditAssocModal: boolean = false;
  ngOnInit () {
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
  // Add a new function to open the edit modal
editAssocModal(): void {
  this.isEditAssocModal = true;
  // Assign the selected associate to the property
}
closeEditAssocModal(): void {
  this.isEditAssocModal = false;
}

// Add a new function to handle the edit action
editAssoc(event: Event): void {
  // Update the selected associate using the API endpoint or another method
  this.http.post('https://phpapicsci467.azurewebsites.net/php_script/EditAssoc.php', this.selectedAssocForEdit).subscribe((response: any) => {
    // Handle the response as needed
    console.log(response);
  });

  // Close the edit modal
  this.isEditAssocModal = false;
}
  
  delAssoc(): void {

  }
  // Existing methods ...

// New method for searching associates
searchAssoc(): void {
  // Use the search term to make a request to the PHP script
  this.http.post('https://phpapicsci467.azurewebsites.net/php_script/AssocSearch.php', { searchTerm: this.searchTerm }).subscribe((response: any) => {
    this.assoc = response;
  });
}


// Existing methods ...

  viewAssoc(): void {

  }
  searchQuote (): void {
    this.http.post('https://phpapicsci467.azurewebsites.net/php_script/QuoteSearch.php', { searchTerm2: this.searchTerm2 }).subscribe((response: any) => {
      this.quote = response;
    });
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