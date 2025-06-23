import { bootstrapApplication } from "@angular/platform-browser";
import { appConfig } from "./app/app.config";
import { AppComponent } from "./app/app.component";
// Import Chart.js configuration to register all chart types globally
import "./app/config/chart.config";

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err),
);
