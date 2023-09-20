import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  Showlogin(): void{
    const forDisplay = document.getElementById("LoginForm");
    const logButton = document.getElementById("OpenLogin");
    const closeButton = document.getElementById("CloseLogin");
    if(forDisplay != null && logButton != null && closeButton != null){
      forDisplay.style.display = "block";
      logButton.style.display = "none";
      closeButton.style.display="block";
    }
  }

  CloseLogin(): void{
    const forDisplay = document.getElementById("LoginForm");
    const logButton = document.getElementById("OpenLogin");
    const closeButton = document.getElementById("CloseLogin");
    if(forDisplay != null && logButton != null && closeButton != null){
      forDisplay.style.display = "none";
      logButton.style.display = "block";
      closeButton.style.display="none";
    }
  }
}
