import { Component, DestroyRef, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { Router, ActivatedRoute, RouterLink } from "@angular/router";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSnackBarModule, MatSnackBar } from "@angular/material/snack-bar";
import { EMPTY } from "rxjs";
import { catchError, finalize } from "rxjs/operators";
import { AuthService } from "../../services";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    RouterLink,
  ],
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.scss",
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);
  private destroyRef = inject(DestroyRef);

  loginForm: FormGroup = this.fb.group({
    email: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required, Validators.minLength(6)]],
  });
  isLoading = false;
  hidePassword = true;

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    const { email, password } = this.loginForm.value;

    this.authService
      .login({ email, password })
      .pipe(
        finalize(() => (this.isLoading = false)),
        catchError((error) => {
          this.snackBar.open(error.error?.message || "Login failed. Please try again.", "Close", {
            duration: 5000,
            panelClass: ["error-snackbar"],
          });
          return EMPTY;
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        const returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/dashboard";
        this.router.navigate([returnUrl]);
      });
  }

  getEmailError(): string {
    const email = this.loginForm.get("email");
    if (email?.hasError("required")) {
      return "Email is required";
    }
    if (email?.hasError("email")) {
      return "Please enter a valid email";
    }
    return "";
  }

  getPasswordError(): string {
    const password = this.loginForm.get("password");
    if (password?.hasError("required")) {
      return "Password is required";
    }
    if (password?.hasError("minlength")) {
      return "Password must be at least 6 characters";
    }
    return "";
  }
}
