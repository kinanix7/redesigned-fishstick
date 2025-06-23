import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { MatTableModule } from "@angular/material/table";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatChipsModule } from "@angular/material/chips";
import { MatMenuModule } from "@angular/material/menu";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { DeliveryRequestService } from "../../../services/delivery-request.service";
import { AuthService } from "../../../services/auth.service";
import {
  DeliveryRequest,
  RequestStatus,
} from "../../../models/delivery-request.model";

@Component({
  selector: "app-request-list",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatMenuModule,
    MatSnackBarModule,
  ],
  templateUrl: "./request-list.component.html",
  styleUrls: ["./request-list.component.scss"],
})
export class RequestListComponent implements OnInit {
  requests: DeliveryRequest[] = [];
  displayedColumns: string[] = [];
  pageTitle = "";
  RequestStatus = RequestStatus;

  constructor(
    private deliveryRequestService: DeliveryRequestService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.setupComponent();
    this.loadRequests();
  }

  setupComponent(): void {
    if (this.isDriver()) {
      this.pageTitle = "Delivery Requests for My Trips";
      this.displayedColumns = [
        "tripInfo",
        "sender",
        "locations",
        "package",
        "status",
        "actions",
      ];
    } else if (this.isSender()) {
      this.pageTitle = "My Delivery Requests";
      this.displayedColumns = [
        "tripInfo",
        "locations",
        "package",
        "status",
        "actions",
      ];
    } else {
      this.pageTitle = "All Delivery Requests";
      this.displayedColumns = [
        "tripInfo",
        "sender",
        "locations",
        "package",
        "status",
        "actions",
      ];
    }
  }

  loadRequests(): void {
    let requestObservable;

    if (this.isDriver()) {
      requestObservable = this.deliveryRequestService.getRequestsForMyTrips();
    } else if (this.isSender()) {
      requestObservable = this.deliveryRequestService.getMyRequests();
    } else {
      requestObservable = this.deliveryRequestService.getAllRequests();
    }

    requestObservable.subscribe({
      next: (requests) => {
        this.requests = requests;
      },
      error: (error) => {
        this.snackBar.open("Failed to load requests", "Close", {
          duration: 3000,
        });
      },
    });
  }

  updateStatus(request: DeliveryRequest, status: RequestStatus): void {
    this.deliveryRequestService
      .updateRequestStatus(request.id, status)
      .subscribe({
        next: (updatedRequest) => {
          const index = this.requests.findIndex((r) => r.id === request.id);
          if (index !== -1) {
            this.requests[index] = updatedRequest;
          }

          const actionMap: { [key in RequestStatus]: string } = {
            [RequestStatus.PENDING]: "updated",
            [RequestStatus.ACCEPTED]: "accepted",
            [RequestStatus.REJECTED]: "rejected",
            [RequestStatus.DELIVERED]: "marked as delivered",
          };

          this.snackBar.open(
            `Request ${actionMap[status]} successfully`,
            "Close",
            { duration: 3000 },
          );
        },
        error: (error) => {
          this.snackBar.open("Failed to update request status", "Close", {
            duration: 3000,
          });
        },
      });
  }

  hasDimensions(request: DeliveryRequest): boolean {
    return !!(
      request.packageWidth ||
      request.packageHeight ||
      request.packageLength ||
      request.packageWeight
    );
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  }

  getNoDataMessage(): string {
    if (this.isDriver()) {
      return "No delivery requests have been made for your trips yet.";
    } else if (this.isSender()) {
      return "You haven't made any delivery requests yet. Find available trips to get started.";
    } else {
      return "No delivery requests found in the system.";
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
