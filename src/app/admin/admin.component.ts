import { Component, ElementRef, Renderer2, ViewChild, OnInit, Inject } from '@angular/core';
import { Router, NavigationEnd,ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';




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
  EditName: any;
  EditPassword: any;
  EditSales: any;
  EditAddress: any;
  add: any;
  edit: any;
  savedAssoc: any;
  
  isAddAssocModal: boolean = false;
  isMainScreen: boolean = true;

  ID: string= "";
  Password: string= "";
  Name: string = "";
  SalesCommision: string = "";
  Address: string= "";
  AdminFlag: any;
  selectedAssoc: any;
  selectedStatus: any;
  selectedAssocForEdit: any ={};
  isEditAssocModal: boolean = false;
  SelectedAction: string = "";
  selectedQuoteDetails: any;
  total: any;
  isViewQuoteModal: boolean  =false;
  quoteID:any;

  ngOnInit () {
    this.Datacheck();
    this.http.get('https://phpapicsci467.azurewebsites.net/php_script/AssociateTable.php').subscribe((response:any) => {
      this.assoc = response;
      this.FilteredAssoc = this.assoc;
      
      console.log(this.assoc);

    });
  
  this.http.get('https://phpapicsci467.azurewebsites.net/php_script/QuoteTable.php').subscribe((response:any) => {
    this.quote = response;
    this.FilteredQuote = this.quote;
    console.log(this.quote);
  });

  }
  
  //Open or Close ('Add')
  AssociateModal(): void {
    this.ID = "";
    this.Name = "";
    this.Address = "";
    this.Password = "";
    this.isAddAssocModal = !this.isAddAssocModal;
    this.isMainScreen = !this.isMainScreen;
  }

  //Open or Close ('Add')
  EditAssociateModal(): void {
    this.isEditAssocModal = !this.isEditAssocModal;
    this.isMainScreen = !this.isMainScreen;
  }

  addAssoc(event:Event): void {
    for(let i=0;i<this.assoc.length;++i){ 
        if(this.ID===this.assoc[i]['ID']) {
          alert("this id is in use");
          this.ID="";
          location.reload();
        }
    }
    if(this.Name.length > 50){
      confirm("Name is too large. Please Try Again");
      this.Name = "";
    }else if(this.Password.length > 12){
      alert("Password is too large. Pleaser Try Again");
      this.Password = "";
    }else if(this.Address.length > 60){
      alert("Address is too large. Please Try Again");
      this.Address = "";
    }else if(this.ID.length > 10 ){
      alert("ID is too large, Please Try Again");
      this.ID = "";
    }else{
      const AddASSOCData = {
        ID: this.ID,
        Name: this.Name,
        Password: this.Password,
        Address: this.Address,
        AdminFlag: this.AdminFlag
      }
      this.http.post('https://phpapicsci467.azurewebsites.net/php_script/AddAssociate.php', AddASSOCData).subscribe((response:any)=> {
        this.add = response;
        location.reload();
      });  
    }
  }

  // Add a new function to open the edit modal
editAssocModal(selectedRow: any): void {
  this.selectedAssocForEdit = {...selectedRow};
  
  this.isEditAssocModal = true;
  this.isMainScreen = false;

  this.ID=this.selectedAssocForEdit['ID'];
  this.Name=this.selectedAssocForEdit['Name'];
  this.Password=this.selectedAssocForEdit['Password'];
  this.Address=this.selectedAssocForEdit['Address'];
}

  
AssocAction(selectedRow: any): void {
  if(this.SelectedAction === 'Delete'){
  } else if(this.SelectedAction === 'View'){}
  else if(this.SelectedAction ==='Edit'){}
  console.log(selectedRow);
}
// Add a new function to handle the edit action
// In your component
editAssoc(): void {


  if(this.Name.length > 50){
    confirm("The 'Name' you entered is too long. Please Try Again");
    location.reload();
  }else if(this.Password.length > 12){
    alert("Password too large. Pleaser Try Again");
    location.reload();
  }else if(this.Address.length > 60){
    alert("Address too large. Please Try Again");
    location.reload();
  }
  else{
    const FinalAssocData = {
      ID: this.ID,
      Name: this.Name,
      Password: this.Password,
      Address: this.Address
    };
      // Handle the "Edit" button click
      // Update the selected associate using the API endpoint or another method
      console.log(FinalAssocData);
      this.http.post('https://phpapicsci467.azurewebsites.net/php_script/EditAssoc.php', FinalAssocData, { headers: { 'Content-Type': 'application/json' } }).subscribe((response: any) => {
        // Handle the response as needed
        console.log('HTTP Response:', response);
  
        location.reload();
      });
  }     
}


/*
 * This Function Will Reset the Assoc Table for the Next Search
*/
ResetAssoc(): void {
  this.FilteredAssoc = this.assoc;
}
  

deleteAssocUrl="https://phpapicsci467.azurewebsites.net/php_script/deleteAssociate.php";
delAssoc(): void {
  const id = this.ID;
  const confirmation = confirm('Are you sure you want to delete this associate?');
  if (confirmation) {
    // Call your delete API endpoint with the specific ID  
    this.http.post('https://phpapicsci467.azurewebsites.net/php_script/deleteAssociate.php', { id }).subscribe((response: any) => {    
      if (response.success) {
        location.reload();   
      }else {        
        alert('Error deleting associate: ' + response.message);      
      }
      
    });
  }
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

/*
  Reset Quote Function
*/
ResetQuote(): void{
  this.FilteredQuote = this.quote;
}


// filters quote table by status
statusFilter(): void {
  const url = 'https://phpapicsci467.azurewebsites.net/php_script/StatusFilter.php';
  const params = { status: this.selectedStatus };

  if(this.selectedStatus == 'A'){
    this.ResetQuote();
  }else{
    this.http.post(url, params).subscribe((response: any) => {
      this.FilteredQuote = response;
    });
  }
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
        console.log(key);
        if(key == "CustName" || key == "AssocID")
        if(row[key].toLowerCase().includes(this.searchTerm2.toLowerCase())){
          console.log(row);
          FilteredData.push(MatchedRow);
          break;
        }
      
      }
    }
    this.FilteredQuote = FilteredData;
    if(this.FilteredQuote.length == 0){
      alert("No Matches");
      this.FilteredQuote = this.quote;
    }
  }
}

 // Add these properties to your component

// Add these properties to your component
startDate: string = '';
endDate: string = '';

// Modify your filtering logic
searchByDate(): void {
  // Add date filtering logic
  if (this.startDate && this.endDate) {
    const startDateTime = new Date(this.startDate).getTime();
    const endDateTime = new Date(this.endDate).getTime();

    this.FilteredQuote = this.quote.filter(row => {
      const quoteDate = new Date(row.QuoteDate).getTime();
      const processDate = new Date(row.ProcessDate).getTime();
      return ((quoteDate >= startDateTime && quoteDate <= endDateTime) || (processDate >= startDateTime && processDate <= endDateTime));
    });
    console.log(this.quote)
  }
}

 

viewQuote(rowID: any, Total: any): void {
  this.isViewQuoteModal = true;
  this.isMainScreen = false;
  const quoteData = {
    quoteID: rowID
  }
  this.http.post('https://phpapicsci467.azurewebsites.net/php_script/ViewQuote.php', quoteData).subscribe((response: any) => {
    this.selectedQuoteDetails = response;
    this.total = Total;
  });
}


closeViewQuoteModal(): void {
  // Close the view quote modal
  this.isViewQuoteModal = false;
  this.isMainScreen = true;
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
