import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSnackBarModule, MatSnackBar } from "@angular/material/snack-bar";
import { MatIconModule } from "@angular/material/icon";
import { trigger, transition, style, animate } from "@angular/animations";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-register",
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
    MatIconModule,
    RouterLink,
  ],
  templateUrl: "./register.component.html",
  styleUrl: "./register.component.scss",
  animations: [
    trigger("fadeIn", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateY(20px)" }),
        animate("400ms ease-out", style({ opacity: 1, transform: "translateY(0)" })),
      ]),
    ]),
    trigger("slideIn", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateX(-30px)" }),
        animate("500ms ease-out", style({ opacity: 1, transform: "translateX(0)" })),
      ]),
    ]),
  ],
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  hidePassword = true;
  hideConfirmPassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {
    this.registerForm = this.fb.group(
      {
        name: ["", [Validators.required, Validators.minLength(2)]],
        email: ["", [Validators.required, Validators.email]],
        password: ["", [Validators.required, Validators.minLength(6)]],
        confirmPassword: ["", Validators.required],
      },
      { validators: this.passwordMatchValidator },
    );
  }

  passwordMatchValidator(form: FormGroup): { [key: string]: boolean } | null {
    const password = form.get("password");
    const confirmPassword = form.get("confirmPassword");
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  getPasswordStrength(): string {
    const password = this.registerForm.get("password")?.value || "";
    if (password.length < 6) {
      return "weak";
    }
    if (password.length < 8) {
      return "medium";
    }
    if (password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)) {
      return "strong";
    }
    return "medium";
  }

  getPasswordStrengthColor(): string {
    const strength = this.getPasswordStrength();
    switch (strength) {
      case "weak":
        return "#f44336";
      case "medium":
        return "#ff9800";
      case "strong":
        return "#4caf50";
      default:
        return "#ccc";
    }
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }

    this.isLoading = true;
    const { name, email, password } = this.registerForm.value;

    this.authService.register({ name, email, password }).subscribe({
      next: () => {
        this.router.navigate(["/dashboard"]);
      },
      error: (error) => {
        this.isLoading = false;
        this.snackBar.open(
          error.error?.message || "Registration failed. Please try again.",
          "Close",
          {
            duration: 5000,
            panelClass: ["error-snackbar"],
          },
        );
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  getNameError(): string {
    const name = this.registerForm.get("name");
    if (name?.hasError("required")) {
      return "Name is required";
    }
    if (name?.hasError("minlength")) {
      return "Name must be at least 2 characters";
    }
    return "";
  }

  getEmailError(): string {
    const email = this.registerForm.get("email");
    if (email?.hasError("required")) {
      return "Email is required";
    }
    if (email?.hasError("email")) {
      return "Please enter a valid email";
    }
    return "";
  }

  getPasswordError(): string {
    const password = this.registerForm.get("password");
    if (password?.hasError("required")) {
      return "Password is required";
    }
    if (password?.hasError("minlength")) {
      return "Password must be at least 6 characters";
    }
    return "";
  }
}
