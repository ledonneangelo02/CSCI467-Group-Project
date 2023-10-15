import { Component, ElementRef, Renderer2, ViewChild, OnInit } from '@angular/core';


@Component({
  selector: 'app-quote',
  templateUrl: './quote.component.html',
  styleUrls: ['./quote.component.css'],

})


export class QuoteComponent{


  @ViewChild('container', { static: true }) container!: ElementRef;

  constructor(private renderer: Renderer2) { }

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

}
