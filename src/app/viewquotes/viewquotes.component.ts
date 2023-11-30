import { Component } from '@angular/core';
import { Router, NavigationEnd,ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-viewquotes',
  templateUrl: './viewquotes.component.html',
  styleUrls: ['./viewquotes.component.css']
})
export class ViewquotesComponent {

  Quotes: any[] = [];

  SearchID: any;
  SearchName: any;
  SearchStatus: any;


  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
    this.FillPage();
  }

  FillPage() {
    this.GetQuotes();
  }

  GetQuotes() {
    this.http.get('https://phpapicsci467.azurewebsites.net/php_script/viewquote/selectQuote.php').subscribe((response: any) => {
      this.Quotes = response;
    });
  }

  ViewQuote(id: number) {
    this.router.navigate(['/quoteedit'], {state: {data: id}});
  }

  isSearched(quote: any) {

    let isSearched: boolean = true;

    if (this.SearchID)
    {
      let IDString: string = quote['ID'];
      if(!IDString.includes(this.SearchID))
      {
        isSearched = false;
      }
    }

    if (this.SearchName)
    {
      let NameString: string = quote['CustName'];
      let TempSearchName: string = this.SearchName;


      if(!NameString.toLowerCase().includes(TempSearchName.toLowerCase()))
      {
        isSearched = false;
      }
    }

    if (this.SearchStatus)
    {
      let StatusString: string = quote['Status'];
      let TempStatusString: string = this.SearchStatus;


      if (StatusString != TempStatusString.toUpperCase())
      {
        isSearched = false;
      }
    }

    return isSearched;
  }

}
