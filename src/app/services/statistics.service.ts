import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Statistics } from "../models/statistics.model";

@Injectable({
  providedIn: "root",
})
export class StatisticsService {
  private readonly API_URL = "http://localhost:8080/api/admin";

  constructor(private http: HttpClient) {}

  getStatistics(): Observable<Statistics> {
    return this.http.get<Statistics>(`${this.API_URL}/statistics`);
  }
}
