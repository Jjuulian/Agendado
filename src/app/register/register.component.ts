import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { DatePickerModule } from 'primeng/datepicker';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    RouterLink,
    DatePickerModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  registerForm!: FormGroup;
  loading: boolean = false;
  errorMsg: string = '';
  minDate: Date = new Date(Date.now() - (1000 * 60 * 60 * 24 * 365 * 18)); //Controla que sea mayor de edad

  constructor(private fb: FormBuilder, private router:Router, private authService: AuthService ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      surname2: [''],
      email: ['', [Validators.required, Validators.email]],
      birthDate: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.passwordsMatchValidator,
    });
  }

  passwordsMatchValidator(group: FormGroup) {
    const pass = group.get('password')?.value;
    const confirmPass = group.get('confirmPassword')?.value;
    return pass === confirmPass ? null : { passwordsMismatch: true };
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;

    this.loading = true;
    this.errorMsg = '';

    const { confirmPassword, ...data } = this.registerForm.value;

    if (data.birthDate instanceof Date) {
      const year = data.birthDate.getFullYear();
      const month = String(data.birthDate.getMonth() + 1).padStart(2, '0');
      const day = String(data.birthDate.getDate()).padStart(2, '0');
      data.birthDate = `${year}-${month}-${day}`;
    }

    this.authService.register(data).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err.error?.message || 'Error en el registro';
      },
    });
  }
}
