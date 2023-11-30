import { Component } from '@angular/core';
import { Router, NavigationEnd,ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-viewquotes',
  templateUrl: './viewquotes.component.html',
  styleUrls: ['./viewquotes.component.css']
})
export class ViewquotesComponent {

  // Holds all quotes recieved from PHP.
  Quotes: any[] = [];

  // Search terms.
  SearchID: any;
  SearchName: any;
  SearchStatus: any;

  // Vars for DataCheck()
  EmpName: any;
  savedAssoc: any;
  AdminFlag: any;

  /***********************************************************
  * Constructor.                                             *
  ***********************************************************/
  constructor(private http: HttpClient, private router: Router) { }

  /***********************************************************
  * This function runs when the page initializes.            *
  ***********************************************************/
  ngOnInit() {
    this.Datacheck();

    this.FillPage();
  }

  /***********************************************************
  * This function gets the quotes, which is filled in.       *
  * the HTML                                                 *
  ***********************************************************/
  FillPage() {
    this.http.get('https://phpapicsci467.azurewebsites.net/php_script/viewquote/selectQuote.php').subscribe((response: any) => {
      this.Quotes = response;
    });
  }

  /***********************************************************
  * This function determines if a quote was searched. It is  *
  * used in the HTML to display quotes if it returns true,   *
  * and hides them if false.                                 *
  ***********************************************************/
  isSearched(quote: any) {
    // Declare boolean; will be returned.
    let isSearched: boolean = true;

    // Check if SearchID is defined.
    if (this.SearchID)
    {
      // Create a string of the quote's id.
      let IDString: string = quote['ID'];
      // Check if the quote id doesn't contain the search id.
      if(!IDString.includes(this.SearchID))
      {
        // Set isSearched to false.
        isSearched = false;
      }
    }

    // Check if SearchName is defined.
    if (this.SearchName)
    {
      // Declare a string of the quote customer and the search name.
      let NameString: string = quote['CustName'];
      let TempSearchName: string = this.SearchName;

      // Check if quote's customer doesn't contain search name.
      if(!NameString.toLowerCase().includes(TempSearchName.toLowerCase()))
      {
        // Set isSearched to false.
        isSearched = false;
      }
    }

    // Similar to previous if statement.
    if (this.SearchStatus)
    {
      let StatusString: string = quote['Status'];
      let TempStatusString: string = this.SearchStatus;

      // Check if the Status matches the temp status.
      if (StatusString != TempStatusString.toUpperCase())
      {
        isSearched = false;
      }
    }

    return isSearched;
  }

  /***********************************************************
  * This function navigates to the quote edit screen with    *
  * the selected id.                                         *
  ***********************************************************/
  ViewQuote(id: number) {
    this.router.navigate(['/quoteedit'], {state: {data: id}});
  }

  /**********************************************************
  * This function will check to make sure a sales associate *
  *   is properly logged in, and it will check if we have a *
  *   current customer selected.                            *
  **********************************************************/
  Datacheck(): void{
    //Stored Associate Name
    var AssocName = localStorage.getItem('AssocName');
    if(AssocName !== null){
      this.EmpName = JSON.parse(AssocName);
    }

    //Stored Admin Flag
    var AdminFlag = localStorage.getItem('AdminFlag');
    if(AdminFlag !== null){
      this.AdminFlag = JSON.parse(AdminFlag);
    }
  
    //Stored Associate ID
    var savedAssoc = localStorage.getItem('CurrentAssoc');
    if(savedAssoc !== null){
      this.savedAssoc = JSON.parse(savedAssoc);
    }else{
      this.router.navigateByUrl('/');
      setTimeout(function(){
        alert("Error: User not found, please Login");
      }, 200);
    }
  }
}
