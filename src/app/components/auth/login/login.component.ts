import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { MatDividerModule } from "@angular/material/divider";
import { AuthService } from "../../../services/auth.service";
import { LoginRequest } from "../../../models/user.model";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatDividerModule,
  ],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = true;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const loginData: LoginRequest = this.loginForm.value;

      this.authService.login(loginData).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.snackBar.open("Login successful!", "Close", { duration: 3000 });
          this.router.navigate(["/dashboard"]);
        },
        error: (error) => {
          this.isLoading = false;
          this.snackBar.open(
            "Login failed. Please check your credentials.",
            "Close",
            { duration: 5000 },
          );
        },
      });
    }
  }

  fillDemoCredentials(role: "admin" | "driver" | "sender"): void {
    const credentials = {
      admin: {
        email: "admin@deliverymatch.com",
        password: "admin123",
      },
      driver: {
        email: "driver@example.com",
        password: "driver123",
      },
      sender: {
        email: "sender@example.com",
        password: "sender123",
      },
    };

    const selectedCredentials = credentials[role];

    this.loginForm.patchValue({
      email: selectedCredentials.email,
      password: selectedCredentials.password,
    });

    // Show feedback to user
    this.snackBar.open(
      `${role.charAt(0).toUpperCase() + role.slice(1)} credentials filled`,
      "Close",
      {
        duration: 2000,
      },
    );
  }
}
