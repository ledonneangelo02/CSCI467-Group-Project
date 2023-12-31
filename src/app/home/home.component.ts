import { Component, Directive, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})


export class HomeComponent {

  constructor(private router: Router, private http : HttpClient){}

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
  Ident : string="";
  Password : string="";
  loginError: boolean = false;
  selectOptions: any[] = [];
  private apiUrl = 'https://phpapicsci467.azurewebsites.net/php_script/QuerySalesAssoc.php';
  ValidateLogin(event : Event){
    const params = new HttpParams()
      .set('Ident', this.Ident)
      .set('password', this.Password);
      
      this.http.get(this.apiUrl,{params: params}).subscribe({
        next: (data: any) => {
          //if Login data is not a valid user
          if(data.length === 0){
            this.loginError = true;
          }else{
            localStorage.setItem('CurrentAssoc', JSON.stringify(data[0]['ID']));
            localStorage.setItem('AssocName', JSON.stringify(data[0]['Name']));
            localStorage.setItem('AdminFlag',JSON.stringify(data[0]['AdminFlag']));
            if(data[0]['AdminFlag'] == 'M'){
              this.router.navigateByUrl('/viewquotes');
            }else if(data[0]['AdminFlag'] == 'Y'){
              this.router.navigateByUrl('/admindash');
            }else{
              this.router.navigateByUrl('/quote');
            }
          }
        },
        error: (error) => {
          // Handle errors
          console.log(error);
          this.loginError = true;
        }
      });
  }

}
