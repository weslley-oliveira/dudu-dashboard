// lib/categories/definitions.ts
export interface Vehicle {
  id: string;
  plate: string;
  make: string;
  type: string;
  series: string;
  mileage: number;
  observations?: string;
  model: string;
  engine_capacity: string; 
  vin: string;
  engine_number: string;
  fuel_type: string;
  status: string;
  company_id?: string | null;
  year_of_manufacture: number;
  mot?: string;
  tracker?: boolean;
  tracker_observation?: string;
  color: string;
}

export type CustomerField = {
  id: string;
  name: string;
};
