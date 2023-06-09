import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AlertService } from 'src/app/services/alert.service';
import { ApiService } from 'src/app/services/api.service';
import { Credentials } from 'src/app/models/credentials';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  credentials = new Credentials;

  constructor(private alertService: AlertService, private router: Router, private apiService: ApiService){}

  onLogin() {
    this.apiService.login(this.credentials, (err) => this.alertService.apiErrorAlert(err))
      .subscribe(_ => this.router.navigate(['spaces']));
  }

  goToSignUp() {
    this.router.navigate(['signup']);
  }
}
