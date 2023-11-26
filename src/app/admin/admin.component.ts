import { Component, ElementRef, Renderer2, ViewChild, OnInit, Inject } from '@angular/core';
import { Router, NavigationEnd,ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';


export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  constructor(private http: HttpClient, private router: Router) { }
  
  //2D arrays for the 2 tables
  assoc: any[]=[];
  FilteredAssoc: any[] = [];
  quote: any[]=[];
  FilteredQuote: any[] = [];

  SalesAssoc: any;
  newAssociate: any = {};
  EmpName: any;
  searchTerm: string = "";
  searchTerm2: string="";
  add: any;
  savedAssoc: any;
  saveEditedAssoc: any;
  isAddAssocModal: boolean = false;
  ID: string= "";
  Password: string= "";
  Name: string = "";
  SalesCommision: string = "";
  Address: string= "";
  selectedAssoc: any;
  selectedAssocForEdit: any ={};
  isEditAssocModal: boolean = false;
  SelectedAction: string = "";


  ngOnInit () {
    this.http.get('https://phpapicsci467.azurewebsites.net/php_script/AssociateTable.php').subscribe((response:any) => {
      this.assoc = response;
      this.FilteredAssoc = this.assoc;
    });
  
  this.http.get('https://phpapicsci467.azurewebsites.net/php_script/QuoteTable.php').subscribe((response:any) => {
    this.quote = response;
    this.FilteredQuote = this.quote;
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


AssocAction(SelectedRow: any): void{
  if(this.SelectedAction === 'Delete'){
    
  }else if(this.SelectedAction === 'View'){

  }else if(this.SelectedAction === 'Edit'){

  }
  console.log(SelectedRow);
}

// Add a new function to handle the edit action
editAssoc(): void {
  // Update the selected associate using the API endpoint or another method
  this.http.post('https://phpapicsci467.azurewebsites.net/php_script/EditAssoc.php', this.selectedAssocForEdit).subscribe((response: any) => {
    // Handle the response as needed
    console.log(response);
  });

  // Close the edit modal
  this.isEditAssocModal = false;
}
  
  
deleteAssoc(): void {
}
  // Existing methods ...


/*
 * This Function Will Reset the Assoc Table for the Next Search
*/
ResetAssoc(): void{
  this.FilteredAssoc = this.assoc;
}

// New method for searching associates
SearchAssoc(): void {
    
  let FilteredData = [];
  this.FilteredAssoc = this.assoc; // Reset to show all data
  if(this.searchTerm === ""){
    this.FilteredAssoc = this.assoc; // Reset to show all data
  }else{
    for(let i = 0; i < this.assoc.length; ++i){
  
      let row = this.assoc[i];
  
      for(const key in row){
        let MatchedRow = row;
        if(row[key].toLowerCase().includes(this.searchTerm.toLowerCase())){
          console.log(row);
          FilteredData.push(MatchedRow);
          break;
        }
      
      }
    }
    this.FilteredAssoc = FilteredData;
  }
    
}


// Existing methods ...
  
viewAssoc(): void {

}

ResetQuote(): void{
  this.FilteredQuote = this.quote;
}

searchQuote (): void {
  let FilteredData = [];
  this.FilteredQuote = this.quote; // Reset to show all data
  if(this.searchTerm2 === ""){
    this.FilteredQuote = this.quote; // Reset to show all data
  }else{
    for(let i = 0; i < this.quote.length; ++i){
      let row = this.quote[i];
      for(const key in row){
        let MatchedRow = row;
        if(row[key].toLowerCase().includes(this.searchTerm2.toLowerCase())){
          console.log(row);
          FilteredData.push(MatchedRow);
          break;
        }
      
      }
    }
    this.FilteredQuote = FilteredData;
  }
}


viewQuote(): void {

}

Datacheck(): void{

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
