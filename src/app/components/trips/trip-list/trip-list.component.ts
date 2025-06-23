import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { MatTableModule } from "@angular/material/table";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatChipsModule } from "@angular/material/chips";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { TripService } from "../../../services/trip.service";
import { AuthService } from "../../../services/auth.service";
import { Trip, TripStatus, PackageType } from "../../../models/trip.model";

@Component({
  selector: "app-trip-list",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
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
  searchDestination = "";
  searchDate = "";
  selectedPackageType = "";
  packageTypes = Object.values(PackageType);

  displayedColumns: string[] = [];
  pageTitle = "";
  showFilters = false;

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
      this.showFilters = false;
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
      this.showFilters = true;
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
      this.showFilters = true;
    }
  }

  loadTrips(): void {
    if (this.isDriver()) {
      this.tripService.getMyTrips().subscribe({
        next: (trips) => {
          this.trips = trips;
          this.applyFilters();
        },
        error: (error) => {
          this.snackBar.open("Failed to load trips", "Close", {
            duration: 3000,
          });
        },
      });
    } else {
      this.tripService.getAvailableTrips().subscribe({
        next: (trips) => {
          this.trips = trips;
          this.applyFilters();
        },
        error: (error) => {
          this.snackBar.open("Failed to load trips", "Close", {
            duration: 3000,
          });
        },
      });
    }
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.trips];

    if (this.searchDestination) {
      filtered = filtered.filter(
        (trip) =>
          trip.destination
            .toLowerCase()
            .includes(this.searchDestination.toLowerCase()) ||
          trip.departureLocation
            .toLowerCase()
            .includes(this.searchDestination.toLowerCase()),
      );
    }

    if (this.searchDate) {
      filtered = filtered.filter((trip) =>
        trip.departureDate.includes(this.searchDate),
      );
    }

    if (this.selectedPackageType) {
      filtered = filtered.filter(
        (trip) => trip.acceptedPackageType === this.selectedPackageType,
      );
    }

    this.filteredTrips = filtered;
  }

  clearFilters(): void {
    this.searchDestination = "";
    this.searchDate = "";
    this.selectedPackageType = "";
    this.applyFilters();
  }

  deleteTrip(trip: Trip): void {
    if (
      confirm(
        `Are you sure you want to delete the trip from ${trip.departureLocation} to ${trip.destination}?`,
      )
    ) {
      this.tripService.deleteTrip(trip.id).subscribe({
        next: () => {
          this.snackBar.open("Trip deleted successfully", "Close", {
            duration: 3000,
          });
          this.loadTrips();
        },
        error: (error) => {
          this.snackBar.open("Failed to delete trip", "Close", {
            duration: 3000,
          });
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
      return "No available trips match your search criteria. Try adjusting your filters.";
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
