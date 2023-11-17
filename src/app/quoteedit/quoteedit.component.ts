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

  SelectedVal: any;
  CustName: any;
  EmpName: any;
  savedAssoc: any;

  quoteForm: FormGroup;
  showSecretNote: boolean = false;
  total: number = 0.0;

  constructor(private http: HttpClient, private router: Router, private formBuilder: FormBuilder, private cd: ChangeDetectorRef) {

    
    this.quoteForm = this.formBuilder.group({
      rows: this.formBuilder.array([
        this.createRow()
      ]),
      SecretNote: ['']
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
    });

    console.log(history.state);
  }
  

  get rowControls() {
    return (this.quoteForm.get('rows') as FormArray).controls;
  }

  /* This function will add another row to the current Quote */
  addRow() {
    const newRow = this.formBuilder.group({
      Item: '',
      Qty: 0,
      Price: 0.0,
    });
    this.calculateRunningTotal();
    (this.quoteForm.get('rows') as FormArray).push(newRow);
  }

  private populateRow() {
    return this.formBuilder.group({
    })
  }

  private createRow() {
    return this.formBuilder.group({
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
    this.showSecretNote = !this.showSecretNote;
  }

  /* **********************************************
   * This function will calculate the Quote Total *
   * **********************************************/
  calculateRunningTotal() {
    const rows = this.quoteForm.get('rows') as FormArray;
  
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


}
