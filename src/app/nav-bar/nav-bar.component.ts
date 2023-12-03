import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd,ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})

export class NavbarComponent{
  AdminFlag: any;
  AdminFlagBool: any;
  AdminPage = false;
  isHomeComponent = false;
  isSalesAssoc = false;
  isManagerPageOne = false;
  isManagerPageTwo = false;
  Admin = false;

  ngOnInit () {
    this.DataCheck();
  }
  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Check if the current route is the home component
        this.isHomeComponent = event.url === '/';
        this.isSalesAssoc = event.url ==='/quote';
        this.isManagerPageOne = event.url === '/viewquotes'
        this.isManagerPageTwo = event.url === '/pocreate'
        this.Admin = event.url === '/admindash'
      }
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

  DataCheck(): void{
        //Stored Admin Flag
        var AdminFlag = localStorage.getItem('AdminFlag');
        if(AdminFlag !== null){
          this.AdminFlag = JSON.parse(AdminFlag);
        }
        if(this.AdminFlag != 'N'){
          this.AdminFlagBool = true;
        }
        if(this.AdminFlag == 'Y'){
          this.AdminPage = true;
        }
  }

  LogOut(): void{
    localStorage.clear();
    this.router.navigateByUrl('/');
    setTimeout(function(){
      alert("Succesfully Logged Out!");
    }, 200);
  }
  
}
