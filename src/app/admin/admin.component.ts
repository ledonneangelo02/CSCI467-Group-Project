import { Component, ElementRef, Renderer2, ViewChild, OnInit } from '@angular/core';
import { Router, NavigationEnd,ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { response } from 'express';
import { event } from 'jquery';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  constructor(private http: HttpClient, private router: Router) { }
  assoc: any[]=[];
  FilteredAssoc: any[] = [];
  quote: any[]=[];
  FilteredQuote: any[] = [];
  SalesAssoc: any;
  newAssociate: any = {};
  EmpName: any;
  EditName: any;
  EditPassword: any;
  EditSales: any;
  EditAddress: any;
    add: any;
  edit: any;
  savedAssoc: any;
  
  isAddAssocModal: boolean = false;
  ID: string= "ID";
  Password: string= "password";
  Name: string = "Name";
  SalesCommision: string = "SalesCommision";
  Address: string="Address";
  searchTerm: string = "";
  selectedAssoc: any;
  searchTerm2: string="";
  selectedStatus: any;
  selectedAssocForEdit: any ={};
  isEditAssocModal: boolean = false;
  SelectedAction: string ="";
  selectedQuoteDetails: any;
  isViewQuoteModal: boolean  =false;
  quoteID:any;
  ngOnInit () {
//private quoteUrl = 'https://phpapicsci467.azurewebsites.net/php_script/FinalizeQuote.php';

    this.http.get('https://phpapicsci467.azurewebsites.net/php_script/AssociateTable.php').subscribe((response:any) => {
      this.assoc= response;
      this.FilteredAssoc = this.assoc;
    });
  
  this.http.get('https://phpapicsci467.azurewebsites.net/php_script/QuoteTable.php').subscribe((response:any) => {
    this.quote = response;
    this.FilteredQuote = this.quote;
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
editAssocModal(selectedRow: any): void {
  this.selectedAssocForEdit = {...selectedRow};
  this.isEditAssocModal = true;
  // Assign the selected associate to the property
}
closeEditAssocModal(): void {
  this.isEditAssocModal = false;
}
AssocAction(selectedRow: any): void {
  if(this.SelectedAction === 'Delete'){
  } else if(this.SelectedAction === 'View'){}
  else if(this.SelectedAction ==='Edit'){}
  console.log(selectedRow);
}
// Add a new function to handle the edit action
// In your component
editAssoc(event: Event): void {
  console.log('Selected Assoc for Edit:', this.selectedAssocForEdit);

  // Log the selectedAssocForEdit object
  console.log('Selected Assoc for Edit Object:', JSON.stringify(this.selectedAssocForEdit));

  if (event) {
    // Handle the "Edit" button click
    // Update the selected associate using the API endpoint or another method
    this.http.post('https://phpapicsci467.azurewebsites.net/php_script/EditAssoc.php', this.selectedAssocForEdit, { headers: { 'Content-Type': 'application/json' } }).subscribe((response: any) => {
      // Handle the response as needed
      console.log('HTTP Response:', response);

      // Close the edit modal
      this.isEditAssocModal = false;
    });
  } else {
    // Handle the "Save Changes" button click
    // Update the selected associate's details directly
    const index = this.assoc.findIndex(a => a.ID === this.selectedAssocForEdit.ID);
    if (index !== -1) {
      // Update the associate details
      this.assoc[index].Name = this.selectedAssocForEdit.Name;
      this.assoc[index].Password = this.selectedAssocForEdit.Password;
      this.assoc[index].SalesCommision = this.selectedAssocForEdit.SalesCommision;
      this.assoc[index].Address = this.selectedAssocForEdit.Address;
      // Close the edit modal
      this.isEditAssocModal = false;
    } else {
      console.error('Associate not found for editing.');
    }
  }
}







// Existing methods ...
ResetAssoc(): void {
  this.FilteredAssoc = this.assoc;
}
  deleteAssocUrl="https://phpapicsci467.azurewebsites.net/php_script/deleteAssociate.php";
  delAssoc(id: string): void {
    const confirmation = confirm('Are you sure you want to delete this associate?');
    if (confirmation) {
        // Call your delete API endpoint with the specific ID
        this.http.post('https://phpapicsci467.azurewebsites.net/php_script/deleteAssociate.php', { id }).subscribe((response: any) => {
            if (response.success) {
                // Update your assoc array or refresh the data
                // For example, you can call your API endpoint to get the updated data
                this.http.get('https://phpapicsci467.azurewebsites.net/php_script/AssociateTable.php').subscribe((updatedResponse: any) => {
                    this.assoc = updatedResponse;
                });
            } else {
                alert('Error deleting associate: ' + response.message);
            }
        });
    }
  }
  // Existing methods ...

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
ResetQuote(): void{
  this.FilteredQuote = this.quote;
}
// filters quote table by status
statusFilter(): void {
  const url = 'https://phpapicsci467.azurewebsites.net/php_script/StatusFilter.php';
  const params = { status: this.selectedStatus };

  this.http.post(url, params).subscribe((response: any) => {
    this.quote = response;
  });
}


// Existing methods ...
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
  
  viewQuote(quoteID: Event): void {
    this.http.get('https://phpapicsci467.azurewebsites.net/php_script/ViewQuote.php').subscribe((response: any) => {
      this.selectedQuoteDetails = response;
      console.log(this.selectedQuoteDetails)
   });
  }
  // Add these properties to your component class
selectedQuote: any = {}; // This will hold the details of the selected quote
ViewQuoteModal(): void {
  this.isViewQuoteModal =true;
}
closeViewQuoteModal(): void {
  // Close the view quote modal
  this.isViewQuoteModal = false;
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