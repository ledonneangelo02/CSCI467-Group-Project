import { Component } from '@angular/core';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; 
import { HomeComponent } from './home/home.component';
import * as $ from 'jquery';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'CSCI467 Group Project';
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
