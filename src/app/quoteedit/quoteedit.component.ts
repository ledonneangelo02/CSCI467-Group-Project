import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { HttpClient, HttpParams} from '@angular/common/http';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray} from '@angular/forms';

@Component({
  selector: 'app-quoteedit',
  templateUrl: './quoteedit.component.html',
  styleUrls: ['./quoteedit.component.css']
})

export class QuoteeditComponent {
  // Variables for Quote Response.
  selectedQuote: any;
  selectedQuoteLines: any[] = [];

  //Quote Details.
  selectedID: number = 0;
  Status: any;
  CustEmail: any;

  // Customer Data.
  Customer: any;
  CustID: any;
  CustomerName: any;
  CustomerContact: any;
  CustomerAddyLn1: any;
  CustomerAddyLn2: any;

  // Variables for Form.
  quoteForm: FormGroup;
  showSecretNote: boolean = false;
  NoteCounter: number = 0;
  ChangeCounter: number = 0;
  maxLineID: number = 0;

  //Discount and Total Amounts.
  total: any = 0.0;
  DiscountType: any = 'P';
  DiscountDollar: number = 0.00;
  DiscountPercent: number = 0.00;
  TempTotal: any = 0;
  DiscountAmount: number = 0.00;

  /***********************************************************
  * This is the constructor of the form.                     *
  ***********************************************************/
  constructor(private http: HttpClient, private router: Router, private formBuilder: FormBuilder, private cd: ChangeDetectorRef) {
    //Build the form.
    this.quoteForm = this.formBuilder.group({
      rows: this.formBuilder.array([]),
      SecretNotes: this.formBuilder.array([])
    });
  }

  /***********************************************************
  * This function runs when the page initializes.            *
  ***********************************************************/
  ngOnInit() {
    this.RetrieveQuote();
  }

  /***********************************************************
  * This gets the quote from the DB and fills the form.      *
  ***********************************************************/
  RetrieveQuote() {
    // Get the ID sent from previous page.
    this.selectedID = history.state.data;

    // Create a new HttpParams array.
    let params = new HttpParams();

    // Append parameters.
    params = params.append('whereTerm', "ID");
    params = params.append('whereValue', this.selectedID);

    // Get the quotes.
    this.http.get('https://phpapicsci467.azurewebsites.net/php_script/selectQuoteWhere.php', {params}).subscribe((response: any) => {
      this.selectedQuote = response;
      // Get the quotes details.
      this.getQuoteDetails(this.selectedQuote[0]);
    });

    // Clear the where term.
    params = params.delete('whereTerm');

    // Append parameters.
    params = params.append('whereTerm', "QuoteID");
    params = params.append('whereValue', this.selectedID);

    // Get the quote lines.
    this.http.get('https://phpapicsci467.azurewebsites.net/php_script/selectQuoteLineWhere.php', {params}).subscribe((response: any) => {
      this.selectedQuoteLines = response;
      // Fill the quote lines in the form.
      this.fillRows();
    });
  }

  /***********************************************************
  * This function will aquire the required quote details of  *
  * of the selected quote and store them for later use       *
  ***********************************************************/
  getQuoteDetails(quotes: any) {
  // Get quote status, ID of the customer, and the email
  // associated with the quote.
    this.Status = quotes['Status'];
    this.CustID = quotes['CustID'];
    this.CustEmail = quotes['CustEmail'];

    // Get the customer info based on the CustID.
    this.RetriveCustInfo(this.CustID);
  }

  /***********************************************************
  * This function acquires the customer's info.              *
  ***********************************************************/
  private custURL='https://phpapicsci467.azurewebsites.net/php_script/pocreate/CustomerInfo.php';
  RetriveCustInfo(CustID: any) : void{
    const quoteData={custID: CustID}
    this.http.post(this.custURL,quoteData, {responseType:'json'}).subscribe(
      response=>{
        this.Customer = response;
        console.log(this.Customer);
        this.CustomerName = this.Customer[0]['name'];
        this.CustomerAddyLn1 = this.Customer[0]['street'];
        this.CustomerAddyLn2 = this.Customer[0]['city'];
        this.CustomerContact = this.Customer[0]['contact'];
    });
  }

  /***********************************************************
  * This function facilitates filling of the form with the   *
  * quote data.                                              *
  ***********************************************************/
  fillRows() {
    // Loop through the selected quote lines.
    for (let line of this.selectedQuoteLines) {
      // Check if the line isn't a secret note.
      if (line['SecretFlag'] == 'N')
      {
        // Populate the row.
        this.populateRow(line);
      }
      else  // Else, it is a secret note.
      { // Populate the secret note section.
        this.populateSecretNote(line);
      }
      // Set the maxLineID to the current LineID. At the end,
      // maxLineID will be the highest value in the DB.
      this.maxLineID = line['LineID'];
    }
    // Increment the maxLineID.
    this.maxLineID++;

    // Calculate the total.
    this.calculateTotal();
  }

  /************************************************************
  * This populates the current row in quote line section with *
  * quote data.                                               *
  ************************************************************/
  populateRow(line: any) {
    // Create a row.
    const newRow = this.formBuilder.group({
      ID: line['LineID'],
      Item: line['RowDesc'],
      Qty: line['RowQty'],
      Price: line['RowPrice'],
      isNew: false,
      isDeleted: false,
    });
    // Push to form.
    (this.quoteForm.get('rows') as FormArray).push(newRow);
  }

 /*************************************************************
  * This populates the current row in the secret notes        *
  * section with secret notes.                                *
  ************************************************************/
  populateSecretNote(line:any) {
    // Set the secret note flag to true. This makes the
    // section visible on the form.
    this.showSecretNote = true;

    // Build the secret note.
    const secretNote = this.formBuilder.group({
      ID: line['LineID'],
      SecretNote: line['RowDesc'],
      isNew: false,  // isNew determines if the row is new. This
                     // determines in the PHP if it needs to be
                     // inserted as a new line, or updated.

      isDeleted: false,  // isDeleted determines if row is marked
                         // for deletion. If it's true, it isn't
                         // viewable on the form page. It also
                         // is deleted in the PHP.
    });
    // Push the form to the form.
    (this.quoteForm.get('SecretNotes') as FormArray).push(secretNote);
    // Increment number of notes.
    this.NoteCounter++;
  }

  /************************************************************
  * This function calculates the quote total.                 *
  ************************************************************/
  calculateTotal() {
    // Get all the rows in the form.
    const rows = this.quoteForm.get('rows') as FormArray;

    // Reset total to 0.
    this.total = 0;
    
    // Cycle through all the rows.
    for (let i = 0; i < rows.length; i++) {
      const row = rows.at(i);
      if (row) {
        const qtyControl = row.get('Qty');
        const priceControl = row.get('Price');
    
        // Calculate the row total; add to total.
        if (qtyControl && priceControl) {
          const qty = qtyControl.value;
          const price = priceControl.value;
          this.total += qty * price;
          this.cd.markForCheck();
        }
      }
    }
  
    // Alert if the total is less than 0.
    if ((this.total = this.total - this.DiscountAmount) < 0)
    {
      alert("Total is less than 0!");
    }
    
  }

  /************************************************************
  * Controls for Quote Line rows in Responsive Form.          *
  ************************************************************/
  get rowControls() {
    return (this.quoteForm.get('rows') as FormArray).controls;
  }

  /************************************************************
  * Controls for Secret Notes rows in Responsive Form.        *
  ************************************************************/
  get SecretNotesControls() {
    return (this.quoteForm.get('SecretNotes') as FormArray).controls;
  }

  /************************************************************
  * This function marks a row for deletion during a quote     *
  * update.                                                   *
  ************************************************************/
  DeleteRow(line: any): void{
    // Check if line is a secret note.
    if (line['SecretFlag'] == 'N')
    {
      // If not, set price to 0 so that it doesn't add to total.
      line['Price'] = 0;
    }
    line['isDeleted'] = true;

    this.calculateTotal();
  }

  /************************************************************
  * This function is used by the form to check if a <div> was *
  * marked for deletion. If so, it does not display.          *
  ************************************************************/
  checkIfDeleted(line: any): boolean
  {
    return line['isDeleted'] == false;
  }

  /************************************************************
  * This function adds another quote line to the form.        *
  ************************************************************/
  addRow() {
    // Create a new row; initialize all values to 0.
    const newRow = this.formBuilder.group({
      ID: this.maxLineID,
      Item: '',
      Qty: 0,
      Price: 0.0,
      isNew: true,
      isDeleted: false,
    });
    this.maxLineID++;
    this.calculateTotal();
    (this.quoteForm.get('rows') as FormArray).push(newRow);
  }

  /************************************************************
  * This function adds another secret note to the form.       *
  ************************************************************/
  AddNote() : void {
    // Check if there are not any notes.
    if(this.NoteCounter <= 0){
      // Calculate the total.
      this.calculateTotal();
      // Show the secret section.
      this.showSecretNote = !this.showSecretNote;
    }

    // Build a new note.
    const newNote = this.formBuilder.group({
      ID: this.maxLineID,
      SecretNote: '',
      isNew: true,
      isDeleted: false,
    });
    (this.quoteForm.get('SecretNotes') as FormArray).push(newNote);
    this.NoteCounter++;
    this.maxLineID++;
  }
  
  /************************************************************
  * This function is used to apply a discount.                *
  ************************************************************/
  ApplyDiscount():void
  {
    //Check if we have changed the Discount before, so we can 
    // reset the Original Total
    if (this.ChangeCounter < 1)
    {
      this.TempTotal = this.total;
    }
    else
    {
      this.total = this.TempTotal;
    }

    ++this.ChangeCounter;
    
    //Check what kind of Discount we are applying
    if(this.DiscountType == 'P')
    {
      // If percent, calculate the discount amount.
      this.DiscountAmount = this.total * (this.DiscountPercent / 100);

      // If it is less than 0; reset the discount percent.
      if(this.total < 0){
        this.total = this.TempTotal;
        this.DiscountPercent = 0.0;
      }
    }
    else if(this.DiscountType == 'D')
    {
      // Get the discount amount in dollars.
      this.DiscountAmount = this.DiscountDollar;

      if(this.total < 0){
        this.DiscountDollar = 0.0;
        this.total = this.TempTotal;
      }
    }

    // Calculate the total.
    this.calculateTotal();
  }

  /************************************************************
  * This function cancels editing and returns to previous     *
  * page.                                                     *
  ************************************************************/
  CancelEdit() {
    this.router.navigate(['/viewquotes']);
  }

  /************************************************************
  * This function updates the quote database.                 *
  ************************************************************/
  private quoteUrl = 'https://phpapicsci467.azurewebsites.net/php_script/updateQuote.php';
  QuoteUpdate() :any {
    // Calculate the total one more time.
    this.calculateTotal();

    // Create data to send to PHP.
    const formData = this.quoteForm.value;
    const FinalformData = {
      formData,
      quoteID: this.selectedID,
      quoteEmail: this.CustEmail,
      quoteStatus: this.Status,
      quoteTotal: this.total,
    };
  
    // Send to PHP.
    this.http.post(this.quoteUrl, FinalformData).subscribe({        
      next: (data: any) => {
      // Handle the data
      alert("Quote Updated!");
      },
      error: (error) => {
        console.error('Error saving data', error);
      }
    });

    // Return to viewquotes page.
    this.router.navigate(['/viewquotes']);
  }
}
