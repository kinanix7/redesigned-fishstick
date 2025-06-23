import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { User, UpdateUserRequest } from "../models/user.model";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private readonly API_URL = "http://localhost:8080/api";

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.API_URL}/admin/users`);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/users/${id}`);
  }

  updateUser(id: number, userData: UpdateUserRequest): Observable<User> {
    return this.http.put<User>(`${this.API_URL}/users/${id}`, userData);
  }

  toggleUserStatus(id: number): Observable<void> {
    return this.http.put<void>(
      `${this.API_URL}/admin/users/${id}/toggle-status`,
      {},
    );
  }

  verifyUser(id: number): Observable<void> {
    return this.http.put<void>(`${this.API_URL}/admin/users/${id}/verify`, {});
  }

  getUserProfile(): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/users/profile`);
  }

  updateProfile(userData: UpdateUserRequest): Observable<User> {
    return this.http.put<User>(`${this.API_URL}/users/profile`, userData);
  }

  getCurrentUserProfile(): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/users/profile`);
  }
}
