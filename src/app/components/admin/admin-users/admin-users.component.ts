import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatTableModule } from "@angular/material/table";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatChipsModule } from "@angular/material/chips";
import { MatMenuModule } from "@angular/material/menu";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { UserService } from "../../../services/user.service";
import { User, UserRole } from "../../../models/user.model";

@Component({
  selector: "app-admin-users",
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatMenuModule,
    MatSnackBarModule,
  ],
  templateUrl: "./admin-users.component.html",
  styleUrls: ["./admin-users.component.scss"],
})
export class AdminUsersComponent implements OnInit {
  users: User[] = [];
  displayedColumns: string[] = [
    "id",
    "name",
    "role",
    "status",
    "createdAt",
    "actions",
  ];

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (error) => {
        this.snackBar.open("Failed to load users", "Close", { duration: 3000 });
      },
    });
  }

  toggleUserStatus(user: User): void {
    const action = user.active ? "deactivate" : "activate";
    if (
      confirm(
        `Are you sure you want to ${action} ${user.firstName} ${user.lastName}?`,
      )
    ) {
      this.userService.toggleUserStatus(user.id).subscribe({
        next: () => {
          user.active = !user.active;
          this.snackBar.open(`User ${action}d successfully`, "Close", {
            duration: 3000,
          });
        },
        error: (error) => {
          this.snackBar.open(`Failed to ${action} user`, "Close", {
            duration: 3000,
          });
        },
      });
    }
  }

  verifyUser(user: User): void {
    if (
      confirm(
        `Are you sure you want to verify ${user.firstName} ${user.lastName}?`,
      )
    ) {
      this.userService.verifyUser(user.id).subscribe({
        next: () => {
          user.verified = true;
          this.snackBar.open("User verified successfully", "Close", {
            duration: 3000,
          });
        },
        error: (error) => {
          this.snackBar.open("Failed to verify user", "Close", {
            duration: 3000,
          });
        },
      });
    }
  }

  viewUserDetails(user: User): void {
    // In a real application, this would navigate to a user detail page
    this.snackBar.open("User details functionality coming soon", "Close", {
      duration: 3000,
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }

  getActiveUsersCount(): number {
    return this.users.filter((user) => user.active).length;
  }

  getVerifiedUsersCount(): number {
    return this.users.filter((user) => user.verified).length;
  }
}
