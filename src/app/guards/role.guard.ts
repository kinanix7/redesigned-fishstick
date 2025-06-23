import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { UserRole } from "../models/user.model";

@Injectable({
  providedIn: "root",
})
export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredRoles = route.data["roles"] as UserRole[];
    const currentUser = this.authService.getCurrentUser();

    if (!currentUser) {
      this.router.navigate(["/login"]);
      return false;
    }

    if (
      requiredRoles &&
      !requiredRoles.includes(currentUser.role as UserRole)
    ) {
      this.router.navigate(["/dashboard"]);
      return false;
    }

    return true;
  }
}
