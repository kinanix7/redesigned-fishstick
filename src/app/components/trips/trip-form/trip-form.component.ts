import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatSelectModule } from "@angular/material/select";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { MatIconModule } from "@angular/material/icon";
import { TripService } from "../../../services/trip.service";
import { CreateTripRequest, PackageType } from "../../../models/trip.model";

@Component({
  selector: "app-trip-form",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatIconModule,
  ],
  templateUrl: "./trip-form.component.html",
  styleUrls: ["./trip-form.component.scss"],
})
export class TripFormComponent implements OnInit {
  tripForm: FormGroup;
  isEditMode = false;
  isLoading = false;
  tripId: number | null = null;
  packageTypes = Object.values(PackageType);

  constructor(
    private fb: FormBuilder,
    private tripService: TripService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
  ) {
    this.tripForm = this.fb.group({
      departureLocation: ["", [Validators.required]],
      destination: ["", [Validators.required]],
      intermediateStops: [""],
      departureDate: ["", [Validators.required]],
      arrivalDate: [""],
      maxWidth: [""],
      maxHeight: [""],
      maxLength: [""],
      maxWeight: [""],
      acceptedPackageType: [""],
      availableCapacity: [""],
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params["id"]) {
        this.isEditMode = true;
        this.tripId = +params["id"];
        this.loadTrip();
      }
    });
  }

  loadTrip(): void {
    if (this.tripId) {
      this.tripService.getTripById(this.tripId).subscribe({
        next: (trip) => {
          this.tripForm.patchValue({
            departureLocation: trip.departureLocation,
            destination: trip.destination,
            intermediateStops: trip.intermediateStops,
            departureDate: new Date(trip.departureDate),
            arrivalDate: trip.arrivalDate ? new Date(trip.arrivalDate) : null,
            maxWidth: trip.maxWidth,
            maxHeight: trip.maxHeight,
            maxLength: trip.maxLength,
            maxWeight: trip.maxWeight,
            acceptedPackageType: trip.acceptedPackageType,
            availableCapacity: trip.availableCapacity,
          });
        },
        error: (error) => {
          this.snackBar.open("Failed to load trip details", "Close", {
            duration: 3000,
          });
          this.goBack();
        },
      });
    }
  }

  onSubmit(): void {
    if (this.tripForm.valid) {
      this.isLoading = true;
      const formValue = this.tripForm.value;

      const tripData: CreateTripRequest = {
        departureLocation: formValue.departureLocation,
        destination: formValue.destination,
        intermediateStops: formValue.intermediateStops || undefined,
        departureDate: formValue.departureDate.toISOString(),
        arrivalDate: formValue.arrivalDate
          ? formValue.arrivalDate.toISOString()
          : undefined,
        maxWidth: formValue.maxWidth || undefined,
        maxHeight: formValue.maxHeight || undefined,
        maxLength: formValue.maxLength || undefined,
        maxWeight: formValue.maxWeight || undefined,
        acceptedPackageType: formValue.acceptedPackageType || undefined,
        availableCapacity: formValue.availableCapacity || undefined,
      };

      const operation = this.isEditMode
        ? this.tripService.updateTrip(this.tripId!, tripData)
        : this.tripService.createTrip(tripData);

      operation.subscribe({
        next: (response) => {
          this.isLoading = false;
          const message = this.isEditMode
            ? "Trip updated successfully!"
            : "Trip created successfully!";
          this.snackBar.open(message, "Close", { duration: 3000 });
          this.router.navigate(["/trips"]);
        },
        error: (error) => {
          this.isLoading = false;
          const message = this.isEditMode
            ? "Failed to update trip"
            : "Failed to create trip";
          this.snackBar.open(message, "Close", { duration: 3000 });
        },
      });
    }
  }

  formatPackageType(type: PackageType): string {
    return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
  }

  goBack(): void {
    this.router.navigate(["/trips"]);
  }
}
