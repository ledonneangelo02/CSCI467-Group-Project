import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})

export class NavbarComponent implements OnInit {
  isHomeComponent = false;
  isQuoteComponent = false;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.url.subscribe(url => {
      this.isHomeComponent = url[0].path === 'home';
      this.isQuoteComponent = url[0].path === 'about';
      // Add similar conditions for other components/pages
    });
  }
}
