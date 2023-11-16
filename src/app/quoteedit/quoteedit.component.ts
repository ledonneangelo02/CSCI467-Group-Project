import { Component, Input, ElementRef, Renderer2, ViewChild, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-quoteedit',
  templateUrl: './quoteedit.component.html',
  styleUrls: ['./quoteedit.component.css']
})


export class QuoteeditComponent {
  responseFromPHP: any;
  selectOptions: any[] = [];
  SelectedVal: any;


  constructor(private renderer: Renderer2, private http: HttpClient) { }

  @ViewChild('container', { static: true }) container!: ElementRef;


  ngOnInit() {
    this.http.get('https://phpapicsci467.azurewebsites.net/php_script/Customers.php').subscribe((response: any) => {
      this.selectOptions = response;
    });

    console.log(history.state);
  }
  

  //Number of rows in the quote
  count: number = 2;

  AddRow() : void{
    var htmlContent = `<div class="col col-lg"> 
                          <div class="p-3 border bg-dark"><input id="Item${this.count}" type="text"></div> 
                          </div> 
                          <div class="col col-md-auto"> 
                              <div class="p-3 border bg-dark"><input id="Qty${this.count}" type="number"></div>
                          </div> 
                          <div class="col col-md-auto"> 
                              <div class=" p-3 border bg-dark"><input id="Price${this.count}" type="number" step="0.01"></div> 
                          </div>
                       </div>`;

    // Create a new HTML element
    const newElement = this.renderer.createElement('hr');
    const newElement2 = this.renderer.createElement('div');
    newElement2.className = 'row';
    newElement.style.borderWidth = '5px';
    newElement.style.color = 'rgb(0,0,0)';
    newElement.style.backgroundColor = 'black';
    newElement2.innerHTML = htmlContent;

    // Append the new element as the last child of the div
    this.renderer.appendChild(this.container.nativeElement, newElement);
    
    this.renderer.appendChild(this.container.nativeElement, newElement2);

    this.count++;
  }
  
  RetriveData() : void{
    console.log(this.SelectedVal);
  }


}
