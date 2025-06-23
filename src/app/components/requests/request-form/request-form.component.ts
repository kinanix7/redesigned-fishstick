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
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { MatIconModule } from "@angular/material/icon";
import { DeliveryRequestService } from "../../../services/delivery-request.service";
import { TripService } from "../../../services/trip.service";
import { CreateDeliveryRequest } from "../../../models/delivery-request.model";
import { PackageType } from "../../../models/trip.model";
import { Trip } from "../../../models/trip.model";

@Component({
  selector: "app-request-form",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatSnackBarModule,
    MatIconModule,
  ],
  templateUrl: "./request-form.component.html",
  styleUrls: ["./request-form.component.scss"],
})
export class RequestFormComponent implements OnInit {
  requestForm: FormGroup;
  isLoading = false;
  availableTrips: Trip[] = [];
  selectedTrip: Trip | null = null;
  packageTypes = Object.values(PackageType);

  constructor(
    private fb: FormBuilder,
    private deliveryRequestService: DeliveryRequestService,
    private tripService: TripService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
  ) {
    this.requestForm = this.fb.group({
      tripId: ["", [Validators.required]],
      pickupLocation: ["", [Validators.required]],
      deliveryLocation: ["", [Validators.required]],
      packageWidth: [""],
      packageHeight: [""],
      packageLength: [""],
      packageWeight: [""],
      packageType: [""],
      description: [""],
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params["tripId"]) {
        const tripId = +params["tripId"];
        this.requestForm.patchValue({ tripId });
        this.loadSelectedTrip(tripId);
      } else {
        this.loadAvailableTrips();
      }
    });
  }

  loadSelectedTrip(tripId: number): void {
    this.tripService.getTripById(tripId).subscribe({
      next: (trip) => {
        this.selectedTrip = trip;
      },
      error: (error) => {
        this.snackBar.open("Failed to load trip details", "Close", {
          duration: 3000,
        });
        this.loadAvailableTrips();
      },
    });
  }

  loadAvailableTrips(): void {
    this.tripService.getAvailableTrips().subscribe({
      next: (trips) => {
        this.availableTrips = trips.filter((trip) => trip.status === "ACTIVE");
      },
      error: (error) => {
        this.snackBar.open("Failed to load available trips", "Close", {
          duration: 3000,
        });
      },
    });
  }

  onSubmit(): void {
    if (this.requestForm.valid) {
      this.isLoading = true;
      const formValue = this.requestForm.value;

      const requestData: CreateDeliveryRequest = {
        tripId: formValue.tripId,
        pickupLocation: formValue.pickupLocation,
        deliveryLocation: formValue.deliveryLocation,
        packageWidth: formValue.packageWidth || undefined,
        packageHeight: formValue.packageHeight || undefined,
        packageLength: formValue.packageLength || undefined,
        packageWeight: formValue.packageWeight || undefined,
        packageType: formValue.packageType || undefined,
        description: formValue.description || undefined,
      };

      this.deliveryRequestService.createRequest(requestData).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.snackBar.open(
            "Delivery request created successfully!",
            "Close",
            { duration: 3000 },
          );
          this.router.navigate(["/requests"]);
        },
        error: (error) => {
          this.isLoading = false;
          this.snackBar.open("Failed to create delivery request", "Close", {
            duration: 3000,
          });
        },
      });
    }
  }

  formatPackageType(type: PackageType): string {
    return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  }

  goBack(): void {
    this.router.navigate(["/requests"]);
  }
}
