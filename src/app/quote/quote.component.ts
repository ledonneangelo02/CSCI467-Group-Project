import { Component, ElementRef, Renderer2, ViewChild, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, NavigationEnd,ActivatedRoute } from '@angular/router';


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
  EmpName: any;
  QuoteRow: any[] = [{Item: '', Qty: 0, Price: 0.0 }];

  constructor(private renderer: Renderer2, private http: HttpClient, private router: Router) { }

  @ViewChild('container', { static: true }) container!: ElementRef;
  @ViewChild('SecretNote', { static: true }) SecretNote!: ElementRef;
  ngOnInit() {
    this.http.get('https://phpapicsci467.azurewebsites.net/php_script/Customers.php').subscribe((response: any) => {
      this.selectOptions = response;
    });
    var CustomerSelect = localStorage.getItem('CurrentCustomer');
    if(CustomerSelect !== null){
      this.SelectedVal = JSON.parse(CustomerSelect);
      console.log(this.SelectedVal);
    }
    var AssocName = localStorage.getItem('AssocName');
    if(AssocName !== null){
      this.EmpName = JSON.parse(AssocName);
    }
    var savedAssoc = localStorage.getItem('CurrentAssoc');
    if(savedAssoc !== null){
      savedAssoc = JSON.parse(savedAssoc);
      console.log(savedAssoc);
    }else{
      this.router.navigateByUrl('/');
      setTimeout(function(){
        alert("Error: User not found, please Login");
      }, 200);
    }
  }
  

  //Number of rows in the quote
  count: number = 1;
  /* This function will Add another row to the current Quote */
  AddRow() : void{
    this.QuoteRow.push({ Item: '', Qty: 0, Price: 0.0 });
    //HTML content for adding another row to the quote
    var htmlContent = `<div class="col col-lg"> 
                          <div class="p-3 border bg-dark"><input style="width: 100%;" [(ngModel)]="QuoteRow[${this.count}].Item" [id]="Item${this.count}" type="text"></div> 
                          </div> 
                          <div class="col col-md-auto"> 
                              <div class="p-3 border bg-dark"><input [(ngModel)]="QuoteRow[${this.count}].Qty" [id]="Qty${this.count}" type="number"></div>
                          </div> 
                          <div class="col col-md-auto"> 
                              <div class=" p-3 border bg-dark"><input [(ngModel)]="QuoteRow[${this.count}].Price" [id]="Price${this.count}" type="number" step="0.01"></div> 
                          </div>
                       </div>`;

    //Creating the Seperating Line
    const newElement = this.renderer.createElement('hr');
    newElement.style.borderWidth = '5px';
    newElement.style.color = 'rgb(0,0,0)';
    newElement.style.backgroundColor = 'black';
    //Creating the new Quote Row
    const newElement2 = this.renderer.createElement('div');
    newElement2.className = 'row';
    newElement2.innerHTML = htmlContent;

    // Append the new element as the last child of the div
    this.renderer.appendChild(this.container.nativeElement, newElement);
    
    this.renderer.appendChild(this.container.nativeElement, newElement2);

    this.count++;
  }
  
  RetriveData() : void{
    console.log(this.SelectedVal);
    localStorage.setItem('CurrentCustomer',this.SelectedVal);
  }

  //We only want 1 Secret Note per Quote
  NoteCount: number = 0;
  AddNote() : void{

    if(this.NoteCount == 0){
      var htmlContent = `<div class="col col-lg"> 
                            <h4>Secret Note</h4>
                            <div class="p-3 border bg-dark"><input style="width:100%;" id="SecretNote" type="text"></div>
                          </div>`;
      //Creating a 'Secret Note'
      const SecretNote = this.renderer.createElement('div');
      SecretNote.className = 'row';
      SecretNote.innerHTML = htmlContent;

      //Creating the Seperating Line
      const newElement = this.renderer.createElement('hr');
      newElement.style.borderWidth = '10px';
      newElement.style.color = 'rgb(0,0,0)';
      newElement.style.backgroundColor = 'black';

      this.renderer.appendChild(this.SecretNote.nativeElement, newElement);
      this.renderer.appendChild(this.SecretNote.nativeElement, SecretNote);
      ++this.NoteCount;
    }else{
      alert("There is already a Secret Note, on this Quote");
    }
  }

  QuoteFinish() : any{
    for (let i = 0; i < this.count; i++) {
      const inputId = `Item${i}`;
      const inputValue = this.container.nativeElement.querySelector(`#${inputId}`).value;
      console.log(`Value of input with ID ${inputId}: ${inputValue}`);
    }
  }

}
