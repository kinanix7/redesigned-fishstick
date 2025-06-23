export enum PackageType {
  FRAGILE = "FRAGILE",
  DOCUMENTS = "DOCUMENTS",
  ELECTRONICS = "ELECTRONICS",
  CLOTHING = "CLOTHING",
  FOOD = "FOOD",
  FURNITURE = "FURNITURE",
  OTHER = "OTHER",
}

export enum TripStatus {
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export interface Trip {
  id: number;
  driverName: string;
  departureLocation: string;
  destination: string;
  intermediateStops?: string;
  departureDate: string;
  arrivalDate?: string;
  maxWidth?: number;
  maxHeight?: number;
  maxLength?: number;
  maxWeight?: number;
  acceptedPackageType?: PackageType;
  availableCapacity?: number;
  status: TripStatus;
  createdAt: string;
}

export interface CreateTripRequest {
  departureLocation: string;
  destination: string;
  intermediateStops?: string;
  departureDate: string;
  arrivalDate?: string;
  maxWidth?: number;
  maxHeight?: number;
  maxLength?: number;
  maxWeight?: number;
  acceptedPackageType?: PackageType;
  availableCapacity?: number;
}
