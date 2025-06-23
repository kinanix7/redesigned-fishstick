import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import {
  DeliveryRequest,
  CreateDeliveryRequest,
  RequestStatus,
} from "../models/delivery-request.model";

@Injectable({
  providedIn: "root",
})
export class DeliveryRequestService {
  private readonly API_URL = "http://localhost:8080/api/requests";

  constructor(private http: HttpClient) {}

  createRequest(
    requestData: CreateDeliveryRequest,
  ): Observable<DeliveryRequest> {
    return this.http.post<DeliveryRequest>(
      `${this.API_URL}/create`,
      requestData,
    );
  }

  getMyRequests(): Observable<DeliveryRequest[]> {
    return this.http.get<DeliveryRequest[]>(`${this.API_URL}/my-requests`);
  }

  getRequestsForMyTrips(): Observable<DeliveryRequest[]> {
    return this.http.get<DeliveryRequest[]>(`${this.API_URL}/for-my-trips`);
  }

  getAllRequests(): Observable<DeliveryRequest[]> {
    return this.http.get<DeliveryRequest[]>(`${this.API_URL}`);
  }

  updateRequestStatus(
    id: number,
    status: RequestStatus,
  ): Observable<DeliveryRequest> {
    return this.http.put<DeliveryRequest>(
      `${this.API_URL}/${id}/status?status=${status}`,
      {},
    );
  }

  getRequestById(id: number): Observable<DeliveryRequest> {
    return this.http.get<DeliveryRequest>(`${this.API_URL}/${id}`);
  }
}
