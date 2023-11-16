import { Component, ElementRef, Renderer2, ViewChild, OnInit, createComponent } from '@angular/core';
import { Router, NavigationEnd,ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-pocreate',
  templateUrl: './pocreate.component.html',
  styleUrls: ['./pocreate.component.css']
})
export class PocreateComponent {
  responseFromPHP: any;
  selectOptions: any[] = [];
  selectedQuote: any[] = [];
  QuoteLine: any;
  SelectedVal: any;
  EmpName: any;
  savedAssoc: any;
  //Discount and Total Amounts
  total: any = 0.0;
  DiscountType: any = 'P';
  DiscountDollar: any = 0.00;
  DiscountPercent: any = 0.00;
  TempTotal: any = 0;


  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
    this.http.get('https://phpapicsci467.azurewebsites.net/php_script/selectQuote.php').subscribe((response: any) => {
      this.selectOptions = response;
    });
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

  private quoteURL='https://phpapicsci467.azurewebsites.net/php_script/selectQuoteLine.php';

  RetriveData() : void{
    for(let i = 0; i < this.selectOptions.length; ++i)
    {
      if(this.selectOptions[i]['ID'] == this.SelectedVal)
      {
        this.total = this.selectOptions[i]['Total'];
        this.selectedQuote = this.selectOptions[i];
      }
    }
    console.log(this.SelectedVal);
    const quoteData={quoteID: this.SelectedVal}
    this.http.post(this.quoteURL,quoteData, {responseType:'json'}).subscribe(
      responseData=>{
        this.QuoteLine=responseData;
        if (this.QuoteLine['SecretFlag']==='Y')
        {
        }
    });
  }
  count: number=2;

DiscountSelect():void
{
  console.log(this.DiscountType);
}

ChangeCounter: number = 0;

//Code below is for applying discount when the button is click
ApplyDiscount():void
{
  if (this.ChangeCounter < 1)
  {
    this.TempTotal = this.total;
  }
  else
  {
    this.total = this.TempTotal;
  }

  ++this.ChangeCounter;

  if(this.DiscountType == 'P')
  {
    console.log("This is %: " + this.DiscountPercent);
    this.total = this.total - (this.total * this.DiscountPercent);
    if(this.total < 0){
      this.total = this.TempTotal;
      this.DiscountPercent = 0.0;
    }
  }
  else if(this.DiscountType == 'D')
  {
    console.log("This is $: " + this.DiscountDollar);
    this.total = this.total - this.DiscountDollar;
    if(this.total < 0){
      this.DiscountDollar = 0.0;
      this.total = this.TempTotal;
     }
  }
}
QuoteProcessUrl = "https://phpapicsci467.azurewebsites.net/php_script/ProcessingSystem.php";
SubmitFinal(): void{

  const FinalQuoteData = {
    QuoteData: this.selectedQuote,
    NewTotal: this.total
  };

  this.http.post(this.QuoteProcessUrl, FinalQuoteData).subscribe({        
    next: (data: any) => {
    // Handle the data
    console.log(data);
    },
    error: (error) => {
      console.error('Error Sending data', error);
    }
  });
    console.log(this.selectedQuote);
}
}


