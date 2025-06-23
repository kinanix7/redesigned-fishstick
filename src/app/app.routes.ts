import { Routes } from "@angular/router";
import { AuthGuard } from "./guards/auth.guard";
import { RoleGuard } from "./guards/role.guard";
import { UserRole } from "./models/user.model";

// Import components
import { LoginComponent } from "./components/auth/login/login.component";
import { RegisterComponent } from "./components/auth/register/register.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { TripListComponent } from "./components/trips/trip-list/trip-list.component";
import { TripFormComponent } from "./components/trips/trip-form/trip-form.component";
import { RequestListComponent } from "./components/requests/request-list/request-list.component";
import { RequestFormComponent } from "./components/requests/request-form/request-form.component";
import { AdminUsersComponent } from "./components/admin/admin-users/admin-users.component";
import { ProfileViewComponent } from "./components/profile/profile-view/profile-view.component";
import { ProfileEditComponent } from "./components/profile/profile-edit/profile-edit.component";

export const routes: Routes = [
  // Default redirect
  { path: "", redirectTo: "/dashboard", pathMatch: "full" },

  // Authentication routes
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },

  // Protected routes
  {
    path: "dashboard",
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },

  // Trip routes
  {
    path: "trips",
    component: TripListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "trips/available",
    component: TripListComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [UserRole.SENDER] },
  },
  {
    path: "trips/create",
    component: TripFormComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [UserRole.DRIVER] },
  },
  {
    path: "trips/:id/edit",
    component: TripFormComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [UserRole.DRIVER, UserRole.ADMIN] },
  },

  // Request routes
  {
    path: "requests",
    component: RequestListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "requests/create",
    component: RequestFormComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [UserRole.SENDER] },
  },

  // Profile routes
  {
    path: "profile",
    component: ProfileViewComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "profile/edit",
    component: ProfileEditComponent,
    canActivate: [AuthGuard],
  },

  // Admin routes
  {
    path: "admin",
    children: [
      {
        path: "",
        redirectTo: "users",
        pathMatch: "full",
      },
      {
        path: "users",
        component: AdminUsersComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: [UserRole.ADMIN] },
      },
    ],
  },

  // Wildcard route
  { path: "**", redirectTo: "/dashboard" },
];
