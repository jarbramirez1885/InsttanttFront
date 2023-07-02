import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Login } from '../../models/login.model';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm;

  constructor(
    //private cartService: CartService,
    private formBuilder: FormBuilder,
    public dialogo: MatDialog,
    private auth: AuthService,
    private router: Router,
    private toastr: ToastrService,
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required, Validators.maxLength(10)])]
    });
  }

  ngOnInit() {
    //this.items = this.cartService.getItems();
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.auth.login(this.loginForm.value).subscribe(
        (result) => {
          if(result.email != "" || result.email != null ){
              this.router.navigate(['/']);
          }
          else{
            this.router.navigate(['/login']);
          }
        },
        (err: Error) => {
          this.toastr.error(err.message);
        }
      );
    }
  }

  handleClear(nameControl: string) {
    this.loginForm.get(nameControl)?.setValue('');
  }
}
