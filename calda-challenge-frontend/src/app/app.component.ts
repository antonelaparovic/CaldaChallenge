import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Calda Challenge';

  constructor(private auth: AuthService, private router: Router) { }

  async ngOnInit() {
    await this.auth.initSession();
  }

  get isLoggedIn(): boolean {
    return !!this.auth.currentUser;
  }

  logout() {
    this.auth.signOut();
    this.router.navigate(['/login']);
  }
}
