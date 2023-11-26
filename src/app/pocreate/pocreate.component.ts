import { Component, Inject, ElementRef, Renderer2, ViewChild, OnInit, createComponent } from '@angular/core';
import { Router, NavigationEnd,ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

@Component({
  selector: 'app-pocreate',
  templateUrl: './pocreate.component.html',
  styleUrls: ['./pocreate.component.css']
})
export class PocreateComponent {
  responseFromPHP: any;
  selectOptions: any[] = [];
  selectedQuote: any = [];
  QuoteLine: any;
  SelectedVal: any;
  EmpName: any;
  savedAssoc: any;
  quoteSelected: boolean = false;
  QuoteID: any;
  //Discount and Total Amounts
  total: any = 0.0;
  DiscountType: any = 'P';
  DiscountDollar: any = 0.00;
  DiscountPercent: any = 0.00;
  TempTotal: any = 0;
  DiscountAmount: number = 0.00;
  ProcessDate: any;
  //Customer Information For PO View
  Customer: any;
  CustomerName: any;
  CustomerContact: any;
  CustomerEmail: any;
  CustomerAddyLn1: any;
  CustomerAddyLn2: any;


  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
    this.Datacheck();
    this.http.get('https://phpapicsci467.azurewebsites.net/php_script/pocreate/selectQuote.php').subscribe((response: any) => {
      this.selectOptions = response;
    });
  }

  private quoteURL='https://phpapicsci467.azurewebsites.net/php_script/pocreate/selectQuoteLine.php';

  RetriveData(QID: any) : void{
    this.quoteSelected = true;
    this.ChangeCounter = 0;
    for(let i = 0; i < this.selectOptions.length; ++i)
    {
      if(this.selectOptions[i]['ID'] == QID)
      {
        this.total = this.selectOptions[i]['Total'];
        this.selectedQuote = this.selectOptions[i];
        this.CustomerEmail = this.selectedQuote['CustEmail'];
        this.DiscountAmount = +this.selectedQuote['Discount'];
        this.QuoteID = QID;
        this.RetriveCustInfo(this.selectOptions[i]['CustID']);
      }
    }
    console.log(this.selectedQuote['ID']);
    const quoteData={quoteID: QID}
    this.http.post(this.quoteURL,quoteData, {responseType:'json'}).subscribe(
      responseData=>{
        this.QuoteLine=responseData;

    });
  }

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

count: number=2;

ChangeCounter: number = 0;

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
    this.total = this.total - (this.total * this.DiscountPercent);
    if(this.total < 0){
      this.total = this.TempTotal;
      this.DiscountPercent = 0.0;
    }
  }
  else if(this.DiscountType == 'D')
  {
    this.total = this.total - this.DiscountDollar;
    if(this.total < 0){
      this.DiscountDollar = 0.0;
      this.total = this.TempTotal;
     }
  }
}

/*
 * This function will submit the quote data to the Purchase Order Processing System
 *   So we can get the commission amount and date for our DB records
*/
QuoteProcessUrl = "https://phpapicsci467.azurewebsites.net/php_script/pocreate/ProcessingSystem.php";
SubmitFinal(): void{

  //Depending on the Type of Discount, apply that to the discount total on the Quote
  if(this.DiscountType == 'D'){
    this.DiscountAmount += Number(this.DiscountDollar);
  }else{
    this.DiscountAmount += Number(this.total * this.DiscountPercent);
  }
  //Quote Data we need to send to PHP
  const FinalQuoteData = {
    QuoteData: this.selectedQuote,
    NewTotal: this.total
  };

  this.http.post(this.QuoteProcessUrl, FinalQuoteData).subscribe({        
    next: (data: any) => {
    // This shows array of response
    console.log(data);

    //New Amount
    const saleAmt: number = data['amount'];
    this.ProcessDate = data['processDay'];
    //tempPct removes "%" -> Pct creates a float
    const tempPct = data['commission'].replace('%','');
    const Pct = parseFloat(tempPct);

    //getting commission rate
    const assocCom = saleAmt * (Pct / 100);
    //array of new associate data
    const assocData = 
    {
      assoc: data['associate'],
      comAmt: assocCom,
      quoteID: this.QuoteID,
      discountAmt: this.DiscountAmount,
      processDate: this.ProcessDate,
      NewTotal: this.total
    }

    //Call the UpdateAssoc Function to place all the new data in our DB
    this.UpdateDB(assocData);

    },
    error: (error) => {
      console.error('Error Sending data', error);
    }
  });
}


/*
 * This function will update our DB with the new sales data as well as 
 *    updating the commission for the Sales Associate who is on the quote
*/
UpdateAssocUrl = "https://phpapicsci467.azurewebsites.net/php_script/pocreate/UpdateSalesAssoc.php";
UpdateDB(assocData:any): void
{
  this.http.post(this.UpdateAssocUrl, assocData).subscribe({        
    next: (data: any) => {
      let x = confirm("PO has been processed (" + this.ProcessDate + ")\n Commission of $" + assocData['comAmt'].toFixed(2) + " has been given to: " + assocData['assoc']);

      if(x){
        location.reload();
      }


    },
    error: (error) => {
      console.error('Error Sending data', error);
    }
  });
}

changeQuote():void{
  this.quoteSelected = false;
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


