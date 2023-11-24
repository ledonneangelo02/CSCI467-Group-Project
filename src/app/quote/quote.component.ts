import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray} from '@angular/forms';


@Component({
  selector: 'app-quote',
  templateUrl: './quote.component.html',
  styleUrls: ['./quote.component.css'],

})

/* ***************************************************************** 
 * This is the QuoteComponent, it is responsible for the interface *
 *  that allows a sales associate to make a quote                  *
 * *****************************************************************/
export class QuoteComponent implements OnInit{

  responseFromPHP: any;
  selectOptions: any[] = [];

  SelectedVal: any;
  CustName: any;
  EmpName: any;
  savedAssoc: any;
  AdminFlag: any;
  CustEmail: any;

  quoteForm: FormGroup;
  showSecretNote: boolean = false;
  total: number = 0.0;

  constructor(private http: HttpClient, private router: Router, private formBuilder: FormBuilder, private cd: ChangeDetectorRef) {
    this.quoteForm = this.formBuilder.group({
      rows: this.formBuilder.array([
        this.createRow() // Creates our inital row, so the page isn't empty
      ]),
      SecretNote: ['']
    });
  }

  ngOnInit() {
    this.http.get('https://phpapicsci467.azurewebsites.net/php_script/Customers.php').subscribe((response: any) => {
      this.selectOptions = response;
    });

    //This will check the localStorage for the Associate ID and if there is a customer currently picked
    this.Datacheck();
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
    for(let i = 0; i < this.selectOptions.length; ++i){
      if(this.selectOptions[i].id == this.SelectedVal){
        this.CustName = this.selectOptions[i].name;
        localStorage.setItem('CurrentCustomer',this.SelectedVal);
        localStorage.setItem('CurrentCustomerName',this.CustName);
      }
    }
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
        QuoteTotal: this.total,
        CutomerEmail: this.CustEmail
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

  /* *********************************************************
   * This function will check to make sure a sales associate *
   *   is properly logged in, and it will check if we have a *
   *   current customer selected.                            *
   * *********************************************************/
  Datacheck(): void{
    //Stored Customer ID
    var CustomerSelect = localStorage.getItem('CurrentCustomer');
    if(CustomerSelect !== null){
      this.SelectedVal = JSON.parse(CustomerSelect);
    }
    //Stored Customer Name
    var CustomerSelectName = localStorage.getItem('CurrentCustomerName');
    if(CustomerSelectName !== null){
      this.CustName = CustomerSelectName;
    }
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
