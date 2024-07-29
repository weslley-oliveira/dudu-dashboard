// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
export type Product = {
  id: string; // UUID
  description: string; // Descrição detalhada da peça
  oemNumber: string; // Número original do fabricante (OEM)
  partNumber: string; // Número de catálogo da peça
  brand: string; // Marca da peça
  unitOfMeasurement: string; // Unidade de medida (ex: unidade, caixa)
  salePrice: number; // Valor de venda unitário da peça
  quantity: number; // Quantidade em estoque
  companyId: string; // UUID da empresa associada
  productUrl: string; // URL do produto no catálogo
};

// Novo tipo para Categoria de Produto
export type CategoryField = {
  id: string;
  category_name: string;
};