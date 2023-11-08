import { Component, ElementRef, Renderer2, ViewChild, OnInit } from '@angular/core';
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
  QuoteLine: any;
  SelectedVal: any;
  EmpName: any;
  savedAssoc: any;
  total: any = 0.0;

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
    this.http.get('https://phpapicsci467.azurewebsites.net/php_script/selectQuote.php').subscribe((response: any) => {
      this.selectOptions = response;
      console.log(this.selectOptions);
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
    this.total = this.selectOptions[this.SelectedVal+1]['Total'];

    const quoteData={quoteID: this.SelectedVal}
    this.http.post(this.quoteURL,quoteData, {responseType:'json'}).subscribe(
      responseData=>{
        this.QuoteLine=responseData;
        if (this.QuoteLine['SecretFlag']==='Y')
        {
        }
        console.log(this.QuoteLine);
    });
  }
  count: number=2;
}
