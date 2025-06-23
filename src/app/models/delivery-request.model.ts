import { PackageType } from "./trip.model";

export enum RequestStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  DELIVERED = "DELIVERED",
}

export interface DeliveryRequest {
  id: number;
  senderName: string;
  senderEmail: string;
  tripId: number;
  pickupLocation: string;
  deliveryLocation: string;
  packageWidth?: number;
  packageHeight?: number;
  packageLength?: number;
  packageWeight?: number;
  packageType?: PackageType;
  description?: string;
  status: RequestStatus;
  createdAt: string;
}

export interface CreateDeliveryRequest {
  tripId: number;
  pickupLocation: string;
  deliveryLocation: string;
  packageWidth?: number;
  packageHeight?: number;
  packageLength?: number;
  packageWeight?: number;
  packageType?: PackageType;
  description?: string;
}
