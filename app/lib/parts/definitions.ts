export interface Part {
  id: string; // UUID
  description: string; // Descrição detalhada da peça
  oemNumber: string; // Número original do fabricante (OEM)
  partNumber: string; // Número de catálogo da peça
  brand: string; // Marca da peça
  unitOfMeasurement: string; // Unidade de medida (ex: unidade, caixa)
  unitPrice: number; // Valor unitário da peça
  quantity: number; // Quantidade em estoque
  companyId: string; // UUID da empresa associada
  productUrl: string; // URL do produto no catálogo
}

export interface Motorcycle {
  id: string; // UUID
  make: string; // Fabricante
  model: string; // Modelo
  year: number; // Ano de fabricação
}