export interface Supplier {
  id: string; // UUID
  name: string; // Nome do fornecedor
  contact_name?: string; // Nome do contato (opcional)
  phone?: string; // Número de telefone (opcional)
  email?: string; // Endereço de email (opcional)
  address?: string; // Endereço (opcional)
  created_at: Date; // Data de criação do registro
  updated_at: Date; // Data da última atualização do registro
}

export type SuppliersField = {
  id: string;
  name: string;
};