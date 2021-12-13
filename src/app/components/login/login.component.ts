import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LogService } from 'src/app/services/log.service';
import { SecurityService } from 'src/app/services/security.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit {

  public loginForm = {password: ""};
  public production = environment.production;

  constructor(private logger: LogService, private router: Router, private security: SecurityService) { }

  ngOnInit(): void {
  }

  sendForm(){
    this.logger.debug("Soumission du formulaire");
    this.security.unlock(this.loginForm.password);
  }

}
