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
  responseFromPHP: any;
  selectedID: number = 0;
  selectedQuote: any[] = [];
  selectedQuoteLines: any[] = [];
  NoteCounter: number = 0;

  SelectedVal: any;
  CustName: any;
  EmpName: any;
  savedAssoc: any;

  //Quote Details
  Status: any;
  CustEmail: any;

  quoteForm: FormGroup;
  showSecretNote: boolean = false;

  maxLineID: number = 0;

  //Discount and Total Amounts
  total: any = 0.0;
  DiscountType: any = 'P';
  DiscountDollar: number = 0.00;
  DiscountPercent: number = 0.00;
  TempTotal: any = 0;
  DiscountAmount: number = 0.00;

  ChangeCounter: number = 0;

  constructor(private http: HttpClient, private router: Router, private formBuilder: FormBuilder, private cd: ChangeDetectorRef) {
  
    this.quoteForm = this.formBuilder.group({
      rows: this.formBuilder.array([
        
      ]),
      SecretNotes: this.formBuilder.array([

      ])
    });

    this.selectedID = history.state.data;
  }

  ngOnInit() {
    let params = new HttpParams();

    params = params.append('whereTerm', "ID");
    params = params.append('whereValue', this.selectedID);


    this.http.get('https://phpapicsci467.azurewebsites.net/php_script/selectQuoteWhere.php', {params}).subscribe((response: any) => {
      this.selectedQuote = response;

      this.getQuoteDetails(this.selectedQuote);
    });

    params = params.delete('whereTerm');
    params = params.append('whereTerm', "QuoteID");
 //   params = params.append('whereValue', this.selectedID);

    this.http.get('https://phpapicsci467.azurewebsites.net/php_script/selectQuoteLineWhere.php', {params}).subscribe((response: any) => {
      this.selectedQuoteLines = response;
      console.log(this.selectedQuoteLines);
      this.fillRows();
    });

    console.log(history.state);
  }
  
  getQuoteDetails(quotes: any) {
    for (let quote of quotes) {
      this.Status = quote['Status'];
    }
  }

  get rowControls() {
    return (this.quoteForm.get('rows') as FormArray).controls;
  }

  /* Controls for Secret Notes rows in Responsive Form */
  get SecretNotesControls() {
    return (this.quoteForm.get('SecretNotes') as FormArray).controls;
  }

  /* This function will add another row to the current Quote */
  addRow() {
    const newRow = this.formBuilder.group({
      ID: this.maxLineID,
      Item: '',
      Qty: 0,
      Price: 0.0,
      isNew: true,
      isDeleted: false,
    });
    this.maxLineID;
    this.calculateTotal();
    (this.quoteForm.get('rows') as FormArray).push(newRow);
  }

  fillRows() {
    for (let line of this.selectedQuoteLines) {
      if (line['SecretFlag'] == 'N')
      {
        this.populateRow(line);
      }
      else
      {
        this.populateSecretNote(line);
      }
      this.maxLineID = line['LineID'];
    }
    this.calculateTotal();
    this.maxLineID++;
    //this.addRow();
    //this.calculateRunningTotal();
  }

  populateRow(line: any) {
    const newRow = this.formBuilder.group({
      ID: line['LineID'],
      Item: line['RowDesc'],
      Qty: line['RowQty'],
      Price: line['RowPrice'],
      isNew: false,
      isDeleted: false,
    });
    (this.quoteForm.get('rows') as FormArray).push(newRow);
  }

  populateSecretNote(line:any) {
    this.showSecretNote = true;

    const secretNote = this.formBuilder.group({
      ID: line['LineID'],
      SecretNote: line['RowDesc'],
      isNew: false,
      isDeleted: false,
    });
    (this.quoteForm.get('SecretNotes') as FormArray).push(secretNote);
    this.NoteCounter++;
  }

  private createRow() {
    return this.formBuilder.group({
      ID: '',
      Item: '',
      Qty: 0,
      Price: 0.0,
      isNew: true,
      isDeleted: false,
    });
  }


  /* **********************************************************
   * This function will aquire the customer that was selected *
   *   and store it for later use.                            *
   * **********************************************************/
  RetriveCustomer() : void{
    //this.CustName = this.selectOptions[this.SelectedVal-1].name;
    localStorage.setItem('CurrentCustomer',this.SelectedVal);
    localStorage.setItem('CurrentCustomerName',this.CustName);
    console.log(this.SelectedVal);
    console.log(this.CustName);
  }


  AddNote() : void {
    if(this.NoteCounter <= 0){
      this.calculateTotal();
      this.showSecretNote = !this.showSecretNote;
    }
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

  /* **********************************************
   * This function will calculate the Quote Total *
   * **********************************************/
  calculateTotal() {
    const rows = this.quoteForm.get('rows') as FormArray;

    this.total = 0;
  
    for (let i = 0; i < rows.length; i++) {
      const row = rows.at(i);
      if (row) {
        const qtyControl = row.get('Qty');
        const priceControl = row.get('Price');
  
        if (qtyControl && priceControl) {
          const qty = qtyControl.value;
          const price = priceControl.value;
          this.total += qty * price;
          this.cd.markForCheck();
        }
      }
    }

    if ((this.total = this.total - this.DiscountAmount) < 0)
    {
      alert("Total is less than 0!");
    }
  
  }

  checkIfDeleted(line: any): boolean
  {
    return line['isDeleted'] == false;
  }

  CancelEdit() {
    this.router.navigate(['/viewquotes']);
  }

  private quoteUrl = 'https://phpapicsci467.azurewebsites.net/php_script/updateQuote.php';
  QuoteUpdate() :any {
    this.calculateTotal();

    const formData = this.quoteForm.value;
    const FinalformData = {
      formData,
      quoteID: this.selectedID,
      quoteStatus: this.Status,
      quoteTotal: this.total,
    };
  
    this.http.post(this.quoteUrl, FinalformData).subscribe({        
      next: (data: any) => {
      // Handle the data
      alert("Quote Updated!");
      },
      error: (error) => {
        console.error('Error saving data', error);
      }
    });

    this.router.navigate(['/viewquotes']);

  
  }

  DeleteRow(line: any): void{

    console.log(line);
    line['isDeleted'] = true;
  }

  //Code below is for applying discount when the button is click
  ApplyDiscount():void
  {
    //Check if we have changed the Discount before, so we can reset the Original Total
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
      this.DiscountAmount = this.total * (this.DiscountPercent / 100);

      console.log((this.DiscountPercent/100));
      if(this.total < 0){
        this.total = this.TempTotal;
        this.DiscountPercent = 0.0;
      }
    }
    else if(this.DiscountType == 'D')
    {
      this.DiscountAmount = this.DiscountDollar;
      if(this.total < 0){
        this.DiscountDollar = 0.0;
        this.total = this.TempTotal;
      }
    }

    this.calculateTotal();
  }


}
