import { Component, Directive } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})


export class HomeComponent {


  ngOnInit(){
    var count = 0;
    $(".butt").on("click", function(){
      console.log(count);
      $('.test').addClass('show').removeClass('hide');
      count = 1;
    });
    if(count == 1){
      $('.test').removeClass('show').addClass('hide');    
    }
  }

  //This function is used to pop up our login form
  Showlogin(): void{
    const forDisplay = document.getElementById("LoginForm");
    const logButton = document.getElementById("OpenLogin");
    const closeButton = document.getElementById("CloseLogin");
    
    if(forDisplay != null && logButton != null && closeButton != null){
      forDisplay.style.display = "block";
      logButton.style.display = "none";
      closeButton.style.display="flex";
    }
    
  }

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
      logButton.style.display = "flex";
      closeButton.style.display="none";
      setTimeout(function(){
        forDisplay.style.display="none";
      }, 900);
    }
  }

  //This is to Validate the login
  Email : string="";
  Password : string="";
  ValidateLogin(event : Event){
    event.preventDefault(); // Prevent the default form submission behavior
    console.log(this.Email);
    console.log(this.Password);
    if(this.Email == "name@example.com" && this.Password == "password"){
      alert("Access Granted");
    }else{
      alert("!! Access Denied !!");
    }
  }

}
