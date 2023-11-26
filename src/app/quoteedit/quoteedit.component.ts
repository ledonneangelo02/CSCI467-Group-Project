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

  quoteForm: FormGroup;
  showSecretNote: boolean = false;
  
  //Discount and Total Amounts
  total: any = 0.0;
  DiscountType: any = 'P';
  DiscountDollar: any = 0.00;
  DiscountPercent: any = 0.00;
  TempTotal: any = 0;
  DiscountAmount: number = 0.00;

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
      ID: '',
      Item: '',
      Qty: 0,
      Price: 0.0,
    });
    this.calculateRunningTotal();
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
    }
    this.addRow();
    //this.calculateRunningTotal();
  }

  populateRow(line: any) {
    const newRow = this.formBuilder.group({
      ID: line['LineID'],
      Item: line['RowDesc'],
      Qty: line['RowQty'],
      Price: line['RowPrice'],
    });
    (this.quoteForm.get('rows') as FormArray).push(newRow);
  }

  populateSecretNote(line:any) {
    this.showSecretNote = true;

    const secretNote = this.formBuilder.group({
      SecretNote: line['RowDesc']
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


  AddNote() : void{
    if(this.NoteCounter <= 0){
      this.calculateRunningTotal();
      this.showSecretNote = !this.showSecretNote;
    }
    const newNote = this.formBuilder.group({
      SecretNote: ''
    });
    (this.quoteForm.get('SecretNotes') as FormArray).push(newNote);
    this.NoteCounter++;
  }

  /* **********************************************
   * This function will calculate the Quote Total *
   * **********************************************/
  calculateRunningTotal() {
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
  
  }

  private quoteUrl = 'https://phpapicsci467.azurewebsites.net/php_script/FinalizeQuote.php';
  QuoteFinish() : any{
    if(this.CustName == null && this.SelectedVal == null){
      alert("No customer selected, please select a customer and try again!");
    }else{
      this.calculateRunningTotal();
      const formData = this.quoteForm.value;
      const FinalformData = {
        formData,
        AssocID: this.savedAssoc,
        CustID: this.SelectedVal,
        CustomerName: this.CustName,
        QuoteTotal: this.total
      };
  
      this.http.post(this.quoteUrl, FinalformData).subscribe({        
        next: (data: any) => {
        // Handle the data
        alert("Quote Submitted!");
        localStorage.removeItem('CurrentCustomer');
        localStorage.removeItem('CurrentCustomerName');
        location.reload();
        },
        error: (error) => {
          console.error('Error saving data', error);
        }
      });
    }
  }

  CancelEdit() {
    console.log("CANCEL");
  }

  QuoteUpdate() {
    console.log("UPDATE");
  }

  DeleteRow(LineID: any): void{

    console.log(LineID);
  }

  DiscountSelect(){
    console.log("DISCOUNTSELECT");
  }

  SubmitFinal() {
    console.log("SUBMITFINAL");
  }

  ApplyDiscount(){
    console.log("APPLYDISCOUNT");
  }


}
