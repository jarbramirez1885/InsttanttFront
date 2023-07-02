import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  dataUser?: string;

  constructor(
    public dialogo: MatDialog,
    private auth: AuthService,
    private router: Router
  ) { 
    auth.getLoggedInName.subscribe(name => this.changeName(name));
  }

  ngOnInit() {
    this.getDataUser(sessionStorage.getItem('dataUser'));
  }

  getDataUser(datauser: any): any {

    if (datauser !== null) {
      this.dataUser = datauser;
      return this.dataUser;
    }

    this.dataUser = "";
    return this.dataUser;
  }

  private changeName(name: string): void {
    this.dataUser = name;
}

  logout() {
    this.auth.logout();
    location.reload();
  }
}
