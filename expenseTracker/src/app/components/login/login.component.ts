import { Component } from '@angular/core';
import { Data, Router } from '@angular/router';

import { AlertService } from 'src/app/services/alert.service';
import { ApiService } from 'src/app/services/api.service';
import { Credentials } from 'src/app/models/credentials';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

/**
 * Screen to login
 */
export class LoginComponent {
  credentials = new Credentials;

  /**
   * Constructor
   * @param alertService Service to display an alert
   * @param router Used to change the route
   * @param apiService Service to access the API
   * @param dataService Access the shared data
   */
  constructor(
    private alertService: AlertService,
    private router: Router,
    private apiService: ApiService,
    private dataService: DataService,
  ) { }

  /**
   * Callback when the user want to login
   */
  onLogin() {
    this.apiService.login(this.credentials, (err) => this.alertService.apiErrorAlert(err))
      .subscribe(_ => {
        this.dataService.username = this.credentials.username;
        this.router.navigate(['spaces']);
      });
  }

  /**
   * Callback to sign up
   */
  goToSignUp() {
    this.router.navigate(['signup']);
  }
}
