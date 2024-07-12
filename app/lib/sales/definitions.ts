export type Sale = {
  id: string;
  customerId: string;
  vehicleId: string | null; // Vehicle is optional
  total: number;
  status: string; // Sale status
  saleCode: string; // Sale code
  createdAt: string; // Creation timestamp
};
