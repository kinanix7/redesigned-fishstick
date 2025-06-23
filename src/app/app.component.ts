import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterOutlet, Router } from "@angular/router";
import { HeaderComponent } from "./components/shared/header/header.component";
import { AuthService } from "./services/auth.service";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  title = "DeliveryMatch";
  showHeader = false;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      this.showHeader = !!user;
    });

    // Check if user is authenticated on app init
    if (this.authService.isAuthenticated()) {
      this.showHeader = true;
    } else {
      this.router.navigate(["/login"]);
    }
  }
}
