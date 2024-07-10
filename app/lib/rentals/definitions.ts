export interface Rental {
  id: string; // UUID
  customerId: string; // UUID
  vehicleId: string; // UUID
  startDate: Date; // TIMESTAMP
  endDate: Date; // TIMESTAMP
  total: number; // DECIMAL(10, 2)
  daypayment: Date; // DATE
  createdAt: Date; // TIMESTAMP
}