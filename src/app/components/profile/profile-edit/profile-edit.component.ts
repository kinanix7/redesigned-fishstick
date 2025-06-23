import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { Router } from "@angular/router";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { AuthService } from "../../../services/auth.service";
import { UserService } from "../../../services/user.service";
import { UpdateUserRequest, AuthResponse } from "../../../models/user.model";

@Component({
  selector: "app-profile-edit",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: "./profile-edit.component.html",
  styleUrls: ["./profile-edit.component.scss"],
})
export class ProfileEditComponent implements OnInit {
  profileForm: FormGroup;
  currentUser: AuthResponse | null = null;
  originalFormValue: any = {};
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {
    this.profileForm = this.fb.group({
      firstName: ["", [Validators.required, Validators.minLength(2)]],
      lastName: ["", [Validators.required, Validators.minLength(2)]],
      email: ["", [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadCurrentProfile();
  }

  loadCurrentProfile(): void {
    if (this.currentUser) {
      const profileData = {
        firstName: this.currentUser.firstName,
        lastName: this.currentUser.lastName,
        email: this.currentUser.email,
      };

      this.profileForm.patchValue(profileData);
      this.originalFormValue = { ...profileData };
    }
  }

  onSubmit(): void {
    if (this.profileForm.valid && this.hasChanges()) {
      this.isLoading = true;
      const updateData: UpdateUserRequest = this.profileForm.value;

      this.userService.updateProfile(updateData).subscribe({
        next: (updatedUser) => {
          this.isLoading = false;

          // Update the current user in auth service
          if (this.currentUser) {
            const updatedAuthUser: AuthResponse = {
              ...this.currentUser,
              firstName: updatedUser.firstName,
              lastName: updatedUser.lastName,
              email: updatedUser.email,
            };

            // Update localStorage and current user
            localStorage.setItem(
              "currentUser",
              JSON.stringify(updatedAuthUser),
            );
            this.authService["currentUserSubject"].next(updatedAuthUser);
          }

          this.originalFormValue = { ...this.profileForm.value };
          this.snackBar.open("Profile updated successfully!", "Close", {
            duration: 3000,
          });
          this.router.navigate(["/profile"]);
        },
        error: (error) => {
          this.isLoading = false;
          this.snackBar.open(
            "Failed to update profile. Please try again.",
            "Close",
            { duration: 5000 },
          );
        },
      });
    }
  }

  resetForm(): void {
    this.profileForm.patchValue(this.originalFormValue);
    this.snackBar.open("Changes have been reset", "Close", { duration: 2000 });
  }

  hasChanges(): boolean {
    const currentValue = this.profileForm.value;
    return (
      JSON.stringify(currentValue) !== JSON.stringify(this.originalFormValue)
    );
  }

  goBack(): void {
    if (this.hasChanges()) {
      if (
        confirm("You have unsaved changes. Are you sure you want to leave?")
      ) {
        this.router.navigate(["/profile"]);
      }
    } else {
      this.router.navigate(["/profile"]);
    }
  }
}
