import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatChipsModule } from "@angular/material/chips";
import { MatDividerModule } from "@angular/material/divider";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { AuthService } from "../../../services/auth.service";
import { UserService } from "../../../services/user.service";
import { User, AuthResponse } from "../../../models/user.model";

@Component({
  selector: "app-profile-view",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatSnackBarModule,
  ],
  templateUrl: "./profile-view.component.html",
  styleUrls: ["./profile-view.component.scss"],
})
export class ProfileViewComponent implements OnInit {
  currentUser: AuthResponse | null = null;
  userProfile: User | null = null;
  isLoading = false;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.isLoading = true;
    this.userService.getUserProfile().subscribe({
      next: (profile) => {
        this.userProfile = profile;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.snackBar.open("Failed to load profile details", "Close", {
          duration: 3000,
        });
      },
    });
  }

  getFullName(): string {
    return this.currentUser
      ? `${this.currentUser.firstName} ${this.currentUser.lastName}`
      : "User";
  }

  getRoleIcon(): string {
    switch (this.currentUser?.role) {
      case "ADMIN":
        return "admin_panel_settings";
      case "DRIVER":
        return "local_shipping";
      case "SENDER":
        return "send";
      default:
        return "person";
    }
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return "Not available";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  refreshProfile(): void {
    this.loadUserProfile();
    this.snackBar.open("Profile refreshed", "Close", { duration: 2000 });
  }

  logout(): void {
    this.authService.logout();
    this.snackBar.open("You have been logged out", "Close", { duration: 2000 });
  }
}
