import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { RouterModule } from "@angular/router";
import { BaseChartDirective } from "ng2-charts";
import { ChartConfiguration, ChartData, ChartType } from "chart.js";
import { AuthService } from "../../services/auth.service";
import { StatisticsService } from "../../services/statistics.service";
import { TripService } from "../../services/trip.service";
import { DeliveryRequestService } from "../../services/delivery-request.service";
import { Statistics } from "../../models/statistics.model";
import { Trip } from "../../models/trip.model";
import { DeliveryRequest } from "../../models/delivery-request.model";

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    BaseChartDirective,
  ],
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  statistics: Statistics | null = null;
  myTrips: Trip[] = [];
  myRequests: DeliveryRequest[] = [];
  requestsForMyTrips: DeliveryRequest[] = [];

  tripChartData: ChartData<"doughnut"> | null = null;
  requestChartData: ChartData<"doughnut"> | null = null;
  adminChartData: ChartData<"bar"> | null = null;

  constructor(
    private authService: AuthService,
    private statisticsService: StatisticsService,
    private tripService: TripService,
    private deliveryRequestService: DeliveryRequestService,
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    if (this.isAdmin()) {
      this.loadAdminData();
    } else if (this.isDriver()) {
      this.loadDriverData();
    } else if (this.isSender()) {
      this.loadSenderData();
    }
  }

  loadAdminData(): void {
    this.statisticsService.getStatistics().subscribe((stats) => {
      this.statistics = stats;
      this.setupAdminChart();
    });
  }

  loadDriverData(): void {
    this.tripService.getMyTrips().subscribe((trips) => {
      this.myTrips = trips;
      this.setupTripChart();
    });

    this.deliveryRequestService
      .getRequestsForMyTrips()
      .subscribe((requests) => {
        this.requestsForMyTrips = requests;
      });
  }

  loadSenderData(): void {
    this.deliveryRequestService.getMyRequests().subscribe((requests) => {
      this.myRequests = requests;
      this.setupRequestChart();
    });
  }

  setupTripChart(): void {
    const active = this.myTrips.filter((t) => t.status === "ACTIVE").length;
    const completed = this.myTrips.filter(
      (t) => t.status === "COMPLETED",
    ).length;
    const cancelled = this.myTrips.filter(
      (t) => t.status === "CANCELLED",
    ).length;

    this.tripChartData = {
      labels: ["Active", "Completed", "Cancelled"],
      datasets: [
        {
          data: [active, completed, cancelled],
          backgroundColor: ["#4caf50", "#2196f3", "#ff9800"],
        },
      ],
    };
  }

  setupRequestChart(): void {
    const pending = this.myRequests.filter(
      (r) => r.status === "PENDING",
    ).length;
    const accepted = this.myRequests.filter(
      (r) => r.status === "ACCEPTED",
    ).length;
    const rejected = this.myRequests.filter(
      (r) => r.status === "REJECTED",
    ).length;
    const delivered = this.myRequests.filter(
      (r) => r.status === "DELIVERED",
    ).length;

    this.requestChartData = {
      labels: ["Pending", "Accepted", "Rejected", "Delivered"],
      datasets: [
        {
          data: [pending, accepted, rejected, delivered],
          backgroundColor: ["#ff9800", "#4caf50", "#f44336", "#2196f3"],
        },
      ],
    };
  }

  setupAdminChart(): void {
    if (!this.statistics) return;

    this.adminChartData = {
      labels: ["Users", "Active Trips", "Total Requests", "Accepted Requests"],
      datasets: [
        {
          label: "Count",
          data: [
            this.statistics.totalUsers,
            this.statistics.activeTrips,
            this.statistics.totalRequests,
            this.statistics.acceptedRequests,
          ],
          backgroundColor: ["#2196f3", "#4caf50", "#ff9800", "#9c27b0"],
        },
      ],
    };
  }

  getCurrentUserName(): string {
    const user = this.authService.getCurrentUser();
    return user ? `${user.firstName} ${user.lastName}` : "User";
  }

  getPendingRequests(): number {
    return this.myRequests.filter((r) => r.status === "PENDING").length;
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
