
// app/lib/vehicles/definitions.ts
export interface Vehicle {
  id: string;
  plate: string;
  make: string;
  model: string;
  series: string;
  type: string;
  year_of_manufacture: number;
  year_registration: string;
  specs: {
    engine_capacity: string;
    power: string;
    mileage: number;
    transmission: string;
    fuel_type: string;
    color: string;
  };
  vin: string;
  engine_number: string;
  status: string;
  price: {
    sale_price: string;
    rental_price: string;
  };
  document_status: string;
  insurance_status: string;
  maintenance_status: string;
  mot: string;
  tracker: boolean;
  tracker_observation: string;
  observations: string;
  company_id: string;
  created_at: string;
  updated_at: string;
}


export type CustomerField = {
  id: string;
  name: string;
};
