import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { ApiService } from 'src/app/services/api.service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent  implements OnInit {
  validationForm!: FormGroup;
  user: User = { 
    user_username: '',
    user_firstname: '',
    user_lastname: '',
    user_email: '',
    user_password: '',
  };

  constructor(private formBuilder: FormBuilder, private router: Router, private apiService: ApiService) { }

  _checkRetypePassword(control: FormControl) {
    let password: string = control.get('password')?.value;
    let confirmPassword: string = control.get('confirmPassword')?.value;
    console.log(password);
    console.log(confirmPassword);

    if (password === confirmPassword) {
      return null
    }

    control.get("confirmPassword")?.setErrors({ mismatch: true });
    return null;
  }


  ngOnInit() {
    this.validationForm = this.formBuilder.group({
      username: new FormControl('', Validators.compose([Validators.required, Validators.minLength(8)])),
      firstname: new FormControl('', Validators.required),
      lastname: new FormControl('', Validators.required),
      email: new FormControl('', Validators.compose([Validators.required, Validators.email])),
      password: new FormControl('', Validators.required),
      confirmPassword: new FormControl('', Validators.required),
    }, { validators: this._checkRetypePassword});
  }

  onSignIn() {
    this.router.navigate(['login']);
  }

  onSignUp() {
    if (this.validationForm.valid) {
      this.user.user_username = this.validationForm.get('username')!.value;
      this.user.user_firstname = this.validationForm.get('firstname')!.value;
      this.user.user_lastname = this.validationForm.get('lastname')!.value;
      this.user.user_email = this.validationForm.get('email')!.value;
      this.user.user_password = this.validationForm.get('password')!.value;

      this.apiService.createUser(this.user);
      this.router.navigate(['login']);
    }
  }
}
