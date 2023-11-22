import { Component } from '@angular/core';
import { Router, NavigationEnd,ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-viewquotes',
  templateUrl: './viewquotes.component.html',
  styleUrls: ['./viewquotes.component.css']
})
export class ViewquotesComponent {

  Quote: any[] = [];
  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
    this.http.get('https://phpapicsci467.azurewebsites.net/php_script/pocreate/selectQuote.php').subscribe((response: any) => {
      this.Quote = response;
      console.log(this.Quote);
    });
  }

  ViewQuote(id: number) {
    this.router.navigate(['/quoteedit'], {state: {data: id}});
  }

}
