export interface ItemRequest {
  id: string; // UUID
  mechanic_id: string; // UUID referente ao id de employees
  item_name: string; 
  item_id: string; // UUID referente ao id do item solicitado (parte/produto/etc.)
  item_type: string; // Tipo do item solicitado (ex: 'part', 'product', etc.)
  quantity: number; // Quantidade do item solicitado
  status: string; // Status da solicitação (ex: 'Pending', 'Approved', 'Rejected')
  created_at: Date; // Data de criação do registro
}

export type ItemRequestsField = {
  id: string;
  item_name: string;
};