import { Component, Directive, OnInit } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})


export class HomeComponent {

  //This function is used to close the form and redisplay the login button
  CloseLogin(): void{
    const Spinning = [
      { transform: "scale(1)" },
      { transform: "scale(0)" },
    ];
    
    const SpinOutTiming = {
      duration: 1000,
      iterations: 1,
    };
    const forDisplay = document.getElementById("LoginForm");
    const logButton = document.getElementById("OpenLogin");
    const closeButton = document.getElementById("CloseLogin");

    if(forDisplay != null && logButton != null && closeButton != null){
      forDisplay.animate(Spinning, SpinOutTiming);
      setTimeout(function(){
        forDisplay.style.visibility="hidden";
      }, 900);
    }
  }

  //This is to Validate the login
  Email : string="";
  Password : string="";
  loginError: boolean = false;
  ValidateLogin(event : Event){
    console.log(this.Email);
    console.log(this.Password);
    if(this.Email == "name@example.com" && this.Password == "password"){
      this.loginError = false;
    }else{
      this.loginError = true;
    }
  }

}
