export interface Company {
  id: string; // UUID
  name: string; // Nome da empresa
  registration_number: string; // Número de registro da empresa
  vat_number?: string; // Número de IVA (opcional)
  address_street?: string; // Rua do endereço (opcional)
  address_number?: string; // Número do endereço (opcional)
  address_complement?: string; // Complemento do endereço (opcional)
  address_city?: string; // Cidade do endereço (opcional)
  address_state?: string; // Estado/região do endereço (opcional)
  address_postcode?: string; // Código postal do endereço (opcional)
  phone?: string; // Número de telefone (opcional)
  email?: string; // Endereço de email (opcional)
  created_at: Date; // Data de criação do registro
  updated_at: Date; // Data da última atualização do registro
}



export type CompaniesField = {
  id: string;
  name: string;
};