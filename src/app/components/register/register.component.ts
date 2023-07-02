import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DocumentType } from '../../models/DocumentType';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from "../confirm-dialog/confirm-dialog.component";
import { Mensajes } from '../../constants/mensajes';
import { UsersService } from '../../services/users.service';
import { User } from '../../models/user.model';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  dataForm!: FormGroup;

  submitted = false;

  docsType: DocumentType[] = [
    { value: 'CC', viewValue: 'Cedula de ciudadania' },
    { value: 'CE', viewValue: 'Cedula de extrangeria' },
    { value: 'TI', viewValue: 'Tarjeta de identidad' },
  ];

  constructor(
    private usersService: UsersService,
    private formBuilder: FormBuilder,
    public dialogo: MatDialog,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.dataForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      phoneNumber: ['', Validators.compose([Validators.required, Validators.pattern(/^[0-9]\d*$/), Validators.maxLength(10)])],
      firstName: ['', Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z \-\']+'), Validators.minLength(2), Validators.maxLength(100)])],
      lastName: ['', Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z \-\']+'), Validators.minLength(2), Validators.maxLength(100)])],
      documentType: ['', Validators.required],
      documentNumber: ['', Validators.compose([Validators.required, Validators.pattern(/^[0-9]\d*$/), Validators.maxLength(10)])],
      birthDate: ['', Validators.required],
      expeditionDate: ['', Validators.required]
    });
  }

  onSubmit() {

    let datauser : User = {
      email: this.dataForm.get('email')?.value,
      phonenumber: this.dataForm.get('phoneNumber')?.value,
      firstname: this.dataForm.get('firstName')?.value,
      lastname: this.dataForm.get('lastName')?.value,
      documenttype: this.dataForm.get('documentType')?.value,
      documentnumber: this.dataForm.get('documentNumber')?.value,
      birthdate: this.dataForm.get('birthDate')?.value,
      expeditiondate: this.dataForm.get('expeditionDate')?.value
    };

    this.usersService.create(datauser)
      .subscribe({
        next: (res) => {
          this.submitted = true;
          this.toastr.success(Mensajes.SUCCESS, 'Success');
          this.router.navigate(['/login']);
        },
        error: (e) => {
          console.error(e);
          this.toastr.error(e, 'Error');
        }
      });
  }

  confirmCreateUser(): void {
    this.dialogo
      .open(ConfirmDialogComponent, {
        data: Mensajes.CONFIRM_CREATE_USER
      })
      .afterClosed()
      .subscribe((confirmado: Boolean) => {
        if (confirmado) {
          this.onSubmit();
        }
      });
  }

  handleClear(nameControl: string) {
    this.dataForm.get(nameControl)?.setValue('');
  }
}
