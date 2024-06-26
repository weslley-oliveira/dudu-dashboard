export interface Employee {
  id: string; // UUID
  user_id: string; // UUID de referência ao usuário
  full_name: string; // Nome completo do usuário
  email: string; // Nome completo do usuário
  phone: string; // Nome completo do usuário
  role: string; // Cargo ('mechanic', 'attendant', 'secretary', 'accountant', etc.)
  hire_date?: string; // Data de contratação (opcional)
  salary: number; // Salário do funcionário
  payment_day: number; // Dia do mês para o pagamento (1-31)
  created_at: Date; // Data de criação do registro 
  updated_at: Date; // Data da última atualização do registro
}

export type EmployeeField = {
  id: string;
  name: string;
};