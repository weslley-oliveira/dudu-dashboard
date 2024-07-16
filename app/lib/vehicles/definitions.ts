
// app/lib/vehicles/definitions.ts
export interface MotTest {
  odometerValue: number;
  expiryDate: number;
  // Adicione outros campos relevantes aqui, se houver.
}

export interface Vehicle {
  id: string;
  registration: string;
  make: string;
  model: string;
  series: string;
  type: string;
  manufacturedate: number;
  manufactureDate: number;
  year_registration: string;
  engineSize: string;
  power: string;
  mileage: number;
  transmission: string;
  fuelType: string;
  primaryColour: string;
  vin: string;
  engine_number: string;
  status: string;
  sale_price: string;
  purchase_price: string;
  rental_price: string;
  document_status: string;
  insurance_status: string;
  maintenance_status: string;
  mot: string;
  tracker: boolean;
  tracker_observation: string;
  observations: string;
  company_id: string; // para onde a peca/moto/office materiasl vao estar localizados
  created_at: string; 
  updated_at: string;
  motTests: MotTest[];
}

export type VehicleField = {
  id: string;
  make: string;
  model: string;
  plate: string;
};

export interface Defect {
  dangerous: boolean;
  text: string;
  type: string;
}

export interface MOTTest {
  motTestNumber: string;
  completedDate: string;
  expiryDate: string | null;
  odometerValue: string;
  odometerUnit: string;
  testResult: string;
  defects: Defect[];
}

export interface VehicleProps {
  vehicleData: {
    registration: string;
    make: string;
    model: string;
    firstUsedDate: string;
    fuelType: string;
    primaryColour: string;
    registrationDate: string;
    manufactureDate: string;
    engineSize: string;
    hasOutstandingRecall: string;
    motTests: MOTTest[];
  };
  vehicle: Vehicle;
}
