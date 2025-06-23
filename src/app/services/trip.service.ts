import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Trip, CreateTripRequest } from "../models/trip.model";

@Injectable({
  providedIn: "root",
})
export class TripService {
  private readonly API_URL = "http://localhost:8080/api/trips";

  constructor(private http: HttpClient) {}

  createTrip(tripData: CreateTripRequest): Observable<Trip> {
    return this.http.post<Trip>(`${this.API_URL}/create`, tripData);
  }

  getAvailableTrips(
    destination?: string,
    departureDate?: string,
  ): Observable<Trip[]> {
    let params = new HttpParams();
    if (destination) {
      params = params.set("destination", destination);
    }
    if (departureDate) {
      params = params.set("departureDate", departureDate);
    }
    return this.http.get<Trip[]>(`${this.API_URL}/available`, { params });
  }

  getMyTrips(): Observable<Trip[]> {
    return this.http.get<Trip[]>(`${this.API_URL}/my-trips`);
  }

  getAllTrips(): Observable<Trip[]> {
    return this.http.get<Trip[]>(`${this.API_URL}`);
  }

  getTripById(id: number): Observable<Trip> {
    return this.http.get<Trip>(`${this.API_URL}/${id}`);
  }

  updateTrip(id: number, tripData: CreateTripRequest): Observable<Trip> {
    return this.http.put<Trip>(`${this.API_URL}/${id}`, tripData);
  }

  deleteTrip(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
