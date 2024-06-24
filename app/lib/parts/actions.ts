'use server';

import { z } from 'zod';
import { QueryResult, sql } from '@vercel/postgres';
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { s3Client } from '../s3-config';
import { Part } from './definitions';

// Definição do esquema de validação com Zod para Part
const PartSchema = z.object({
  id: z.string(),
  description: z.string().min(1, { message: 'Description is required.' }),
  oemNumber: z.string().min(1, { message: 'OEM number is required.' }),
  partNumber: z.string().min(1, { message: 'Part number is required.' }),
  brand: z.string().min(1, { message: 'Brand is required.' }),
  unitOfMeasurement: z.string().min(1, { message: 'Unit of measurement is required.' }),
  unitPrice: z.number().min(0, { message: 'Unit price must be non-negative.' }),
  quantity: z.number().min(0, { message: 'Quantity must be non-negative.' }),
  companyId: z.string(),
  productUrl: z.string().url({ message: 'Invalid product URL.' }),
});

const CreatePart = PartSchema.omit({ id: true });
const UpdatePart = PartSchema.omit({ id: true });

// Tipo temporário para estado
export type State = {
  errors?: {
    description?: string[];
    oemNumber?: string[];
    partNumber?: string[];
    brand?: string[];
    unitOfMeasurement?: string[];
    unitPrice?: string[];
    quantity?: string[];
    productUrl?: string[];
  };
  message?: string | null;
};

export async function createPart(prevState: State, formData: FormData) {
  console.log("FormData", formData)
  // Validar campos do formulário usando Zod
  const validatedFields = CreatePart.safeParse({
    description: formData.get('description'),
    oemNumber: formData.get('oemNumber'),
    partNumber: formData.get('partNumber'),
    brand: formData.get('brand'),
    unitOfMeasurement: formData.get('unitOfMeasurement'),
    unitPrice: parseFloat(formData.get('unitPrice') as string),
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
    description, oemNumber, partNumber, brand, unitOfMeasurement, unitPrice, quantity,
    companyId, productUrl
  } = validatedFields.data;

  // Formatar array de URLs de imagens para a consulta SQL

  // Inserir dados no banco de dados
  try {
    await sql`
      INSERT INTO parts (
        description, oem_number, part_number, brand, unit_of_measurement, unit_price, quantity, 
        company_id, product_url
      )
      VALUES (
        ${description}, ${oemNumber}, ${partNumber}, ${brand}, ${unitOfMeasurement}, ${unitPrice}, ${quantity}, 
        ${companyId}, ${productUrl}
      )
    `;
  } catch (error) {
    console.log("YYYYYY", error)
    // Se ocorrer um erro no banco de dados, retornar um erro específico.
    return {
      message: 'Database Error: Failed to Create Part.',
    };
  }

  // Revalidar o cache para a página de partes e redirecionar o usuário.
  revalidatePath('/dashboard/parts');
  redirect('/dashboard/parts');
}

export async function updatePart(
  id: string,
  prevState: State,
  formData: FormData,
) {
  const validatedFields = UpdatePart.safeParse({
    description: formData.get('description'),
    oemNumber: formData.get('oemNumber'),
    partNumber: formData.get('partNumber'),
    brand: formData.get('brand'),
    unitOfMeasurement: formData.get('unitOfMeasurement'),
    unitPrice: parseFloat(formData.get('unitPrice') as string),
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
    description, oemNumber, partNumber, brand, unitOfMeasurement, unitPrice, quantity,
    companyId, productUrl
  } = validatedFields.data;

  try {
    await sql`
      UPDATE parts
      SET 
        description = ${description}, oem_number = ${oemNumber}, part_number = ${partNumber}, 
        brand = ${brand}, unit_of_measurement = ${unitOfMeasurement}, unit_price = ${unitPrice}, 
        quantity = ${quantity}, company_id = ${companyId}, product_url = ${productUrl}
      WHERE id = ${id}
    `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Part.' };
  }

  revalidatePath('/dashboard/parts');
  redirect('/dashboard/parts');
}

export async function deletePart(id: string) {
  try {
    // Primeiro, obtenha o URL da foto associada ao registro

    const result: QueryResult<Part> = await sql<Part>`SELECT product_url AS "productUrl" FROM parts WHERE id = ${id}`;
    const part = result.rows[0];
    const productUrl = part?.productUrl;

    console.log("testetetetetetet",productUrl)

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
    revalidatePath('/dashboard/parts');
    return { message: 'Deleted Part' };
  } catch (error) {
    console.error('Erro ao deletar parte:', error);
    return { message: 'Database Error: Failed to Delete Part.' };
  }
}