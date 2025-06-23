import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { MatTableModule } from "@angular/material/table";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatChipsModule } from "@angular/material/chips";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { TripService } from "../../../services/trip.service";
import { AuthService } from "../../../services/auth.service";
import { Trip } from "../../../models/trip.model";

@Component({
  selector: "app-trip-list",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatSnackBarModule,
    MatDialogModule,
  ],
  templateUrl: "./trip-list.component.html",
  styleUrls: ["./trip-list.component.scss"],
})
export class TripListComponent implements OnInit {
  trips: Trip[] = [];
  filteredTrips: Trip[] = [];
  displayedColumns: string[] = [];
  pageTitle = "";

  constructor(
    private tripService: TripService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.setupComponent();
    this.loadTrips();
  }

  setupComponent(): void {
    if (this.isDriver()) {
      this.pageTitle = "My Trips";
      this.displayedColumns = [
        "departure",
        "destination",
        "capacity",
        "packageType",
        "status",
        "actions",
      ];
    } else if (this.isSender()) {
      this.pageTitle = "Available Trips";
      this.displayedColumns = [
        "departure",
        "destination",
        "driver",
        "capacity",
        "packageType",
        "status",
        "actions",
      ];
    } else {
      this.pageTitle = "All Trips";
      this.displayedColumns = [
        "departure",
        "destination",
        "driver",
        "capacity",
        "packageType",
        "status",
        "actions",
      ];
    }
  }

  loadTrips(): void {
    if (this.isDriver()) {
      this.tripService.getMyTrips().subscribe({
        next: (trips) => {
          this.trips = trips;
          this.filteredTrips = [...trips];
        },
        error: () => {
          this.snackBar.open("Failed to load trips", "Close", { duration: 3000 });
        },
      });
    } else {
      this.tripService.getAvailableTrips().subscribe({
        next: (trips) => {
          this.trips = trips;
          this.filteredTrips = [...trips];
        },
        error: () => {
          this.snackBar.open("Failed to load trips", "Close", { duration: 3000 });
        },
      });
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  }

  getNoDataMessage(): string {
    if (this.isDriver()) {
      return 'You haven\'t created any trips yet. Click "Create Trip" to get started.';
    } else if (this.isSender()) {
      return "No available trips found.";
    } else {
      return "No trips found in the system.";
    }
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  isDriver(): boolean {
    return this.authService.isDriver();
  }

  isSender(): boolean {
    return this.authService.isSender();
  }
}