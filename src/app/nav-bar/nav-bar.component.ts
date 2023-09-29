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
      this.isQuoteComponent = url[0].path === 'quote';
      // Add similar conditions for other components/pages
    });
  }

  //This function is used to pop up our login form
  Showlogin(): void{

    const ScaleIn = [
      { transform: "scale(0)" },
      { transform: "scale(1)" },
    ];
    const ScaleInTiming = {
      duration: 1000,
      iterations: 1,
    };
    const forDisplay = document.getElementById("LoginForm");
    const logButton = document.getElementById("OpenLogin");
    const closeButton = document.getElementById("CloseLogin");
    
    if(forDisplay != null && logButton != null && closeButton != null){
      forDisplay.animate(ScaleIn, ScaleInTiming);
      forDisplay.style.visibility = "visible";
    }
    
  }

}
