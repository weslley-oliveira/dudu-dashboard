export type Sale = {
  id: string;
  customerId: string;
  vehicleId: string | null; // Vehicle is optional
  total: number;
  unitOfMeasurement: string;
  status: string;
  saleCode: string; // New sale code field
  createdAt: string;
};