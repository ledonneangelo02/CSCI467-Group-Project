import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

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
    const forDisplay = document.getElementById("LoginForm");
    const logButton = document.getElementById("OpenLogin");
    const closeButton = document.getElementById("CloseLogin");
    if(forDisplay != null && logButton != null && closeButton != null){
      forDisplay.style.display = "none";
      logButton.style.display = "flex";
      closeButton.style.display="none";
    }
  }
}
