'use server';

import { z } from 'zod';
import { QueryResult, sql } from '@vercel/postgres';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { s3Client } from '../s3-config';
import { Product } from './definitions';

const ProductSchema = z.object({
  id: z.string(),
  description: z.string().min(1, { message: 'Description is required.' }),
  oemNumber: z.string(),
  partNumber: z.string(),
  brand: z.string(),
  unitOfMeasurement: z.string().min(1, { message: 'Unit of measurement is required.' }),
  salePrice: z.number().min(0, { message: 'Sale price must be non-negative.' }),
  quantity: z.number().min(0, { message: 'Quantity must be non-negative.' }),
  companyId: z.string().min(1, { message: 'Company is required' }),
  productUrl: z.string(),
});

const CreateProduct = ProductSchema.omit({ id: true });
const UpdateProduct = ProductSchema.omit({ id: true });

export type State = {
  errors?: {
    description?: string[];
    oemNumber?: string[];
    partNumber?: string[];
    brand?: string[];
    unitOfMeasurement?: string[];
    salePrice?: string[];
    quantity?: string[];
    productUrl?: string[];
  };
  message?: string | null;
};

export async function createProduct(prevState: State, formData: FormData) {
  console.log("FormData", formData)
  // Validar campos do formulário usando Zod
  const validatedFields = CreateProduct.safeParse({
    description: formData.get('description'),
    oemNumber: formData.get('oemNumber'),
    partNumber: formData.get('partNumber'),
    brand: formData.get('brand'),
    unitOfMeasurement: formData.get('unitOfMeasurement'),
    salePrice: parseFloat(formData.get('salePrice') as string),
    quantity: parseInt(formData.get('quantity') as string),
    companyId: formData.get('companyId'),
    productUrl: formData.get('productUrl'),
  });

  // Se a validação do formulário falhar, retornar erros. Caso contrário, continuar.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Part.',
    };
  }

  // Preparar dados para inserção no banco de dados
  const {
    description, oemNumber, partNumber, brand, unitOfMeasurement, salePrice, quantity,
    companyId, productUrl
  } = validatedFields.data;

  // Inserir dados no banco de dados
  try {
    await sql`
      INSERT INTO products (
        description, oem_number, part_number, brand, unit_of_measurement, sale_price, quantity, 
        company_id, product_url
      )
      VALUES (
        ${description}, ${oemNumber}, ${partNumber}, ${brand}, ${unitOfMeasurement}, ${salePrice}, ${quantity}, 
        ${companyId}, ${productUrl}
      )
    `;
  } catch (error) {
    console.log("Database Error:", error)
    // Se ocorrer um erro no banco de dados, retornar um erro específico.
    return {
      message: 'Database Error: Failed to Create Product.',
    };
  }

  // Revalidar o cache para a página de partes e redirecionar o usuário.
  revalidatePath('/dashboard/products');
  redirect('/dashboard/products');
}

export async function updateProduct(
  id: string,
  prevState: State,
  formData: FormData,
) {
  const validatedFields = UpdateProduct.safeParse({
    description: formData.get('description'),
    oemNumber: formData.get('oemNumber'),
    partNumber: formData.get('partNumber'),
    brand: formData.get('brand'),
    unitOfMeasurement: formData.get('unitOfMeasurement'),
    salePrice: parseFloat(formData.get('salePrice') as string),
    quantity: parseInt(formData.get('quantity') as string),
    companyId: formData.get('companyId'),
    productUrl: formData.get('productUrl'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Part.',
    };
  }

  const {
    description, oemNumber, partNumber, brand, unitOfMeasurement, salePrice, quantity,
    companyId, productUrl
  } = validatedFields.data;

  try {
    await sql`
      UPDATE products
      SET 
        description = ${description}, oem_number = ${oemNumber}, part_number = ${partNumber}, 
        brand = ${brand}, unit_of_measurement = ${unitOfMeasurement}, sale_price = ${salePrice}, 
        quantity = ${quantity}, company_id = ${companyId}, product_url = ${productUrl}
      WHERE id = ${id}
    `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Product.' };
  }

  revalidatePath('/dashboard/products');
  redirect('/dashboard/products');
}

export async function deleteProduct(id: string) {
  try {
    // Primeiro, obtenha o URL da foto associada ao registro

    const result: QueryResult<Product> = await sql<Product>`SELECT product_url AS "productUrl" FROM products WHERE id = ${id}`;
    const product = result.rows[0];
    const productUrl = product?.productUrl;

    console.log("Product URL:", productUrl)

    if (productUrl) {
      // Extraia o nome do arquivo do URL
      const fileName = productUrl.split('/').pop();

      // Delete a foto do S3
      const deleteCommand = new DeleteObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: fileName,
      });

      await s3Client.send(deleteCommand);
    }

    // Delete o registro do banco de dados
    await sql`DELETE FROM parts WHERE id = ${id}`;
    revalidatePath('/dashboard/products');
    return { message: 'Deleted Product' };
  } catch (error) {
    console.error('Erro ao deletar parte:', error);
    return { message: 'Database Error: Failed to Delete Part.' };
  }
}