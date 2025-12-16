import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  mode: 'login' | 'signup' = 'login';
  errorMessage = '';
  loading = false;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) { }

  toggleMode() {
    this.mode = this.mode === 'login' ? 'signup' : 'login';
    this.errorMessage = '';
  }

  async submit() {
    if (this.form.invalid || this.loading) {
      return;
    }

    this.errorMessage = '';
    this.loading = true;

    const email = this.form.value.email!;
    const password = this.form.value.password!;

    const result =
      this.mode === 'login'
        ? await this.auth.signIn(email, password)
        : await this.auth.signUp(email, password);

    this.loading = false;

    if (result.error) {
      this.errorMessage = result.error;
      return;
    }

    this.router.navigate(['/order']);
  }
}
