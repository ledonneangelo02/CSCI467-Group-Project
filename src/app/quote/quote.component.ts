import { Component, ElementRef, Renderer2, ViewChild, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router, NavigationEnd,ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';


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
  quoteForm: FormGroup;
  showSecretNote: boolean = false;

  constructor(private http: HttpClient, private router: Router, private formBuilder: FormBuilder) {
    this.quoteForm = this.formBuilder.group({
      rows: this.formBuilder.array([
        this.createRow()
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
    console.log(this.SelectedVal);
    localStorage.setItem('CurrentCustomer',this.SelectedVal);
  }

  AddNote() : void{
    this.showSecretNote = !this.showSecretNote;
  }


  private quoteUrl = 'https://phpapicsci467.azurewebsites.net/php_script/FinalizeQuote.php';
  QuoteFinish() : any{
    const formData = this.quoteForm.value;
    let params = new HttpParams();
    for (const key in formData) {
      if (formData.hasOwnProperty(key)) {
        if (key === 'SecretNote') {
          // Add the "SecretNote" field to the end of the HttpParams
          params = params.append(key, formData[key]);
        } else {
          params = params.set(key, formData[key]);
        }
      }
    }
    // Include the additional input field if it exists
    if(this.showSecretNote){
      const secretNoteControl = this.quoteForm.get('SecretNote');
      if (secretNoteControl) {
        formData.SecretNote = secretNoteControl.value;
      }
    }
    
    this.http.post(this.quoteUrl, {params: params}).subscribe({        
      next: (data: any) => {
      // Handle the data
      console.log('Data saved successfully');
      },
      error: (error) => {
        console.error('Error saving data', error);
      }
    });
  
}

  /* *********************************************************
   * This function will check to make sure a sales associate *
   *   is properly logged in, and it will check if we have a *
   *   current customer selected.                            *
   * *********************************************************/
  Datacheck(): void{
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
}
