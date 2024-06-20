// app/api/products/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { Product } from '@/app/lib/definitions';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json({ error: 'Invalid query parameter' }, { status: 400 });
  }

  try {
    const data = await sql<Product>`
      SELECT
        id,
        product_name,
        product_code,
        category,
        manufacturer,
        price,
        stock,
        status,
        observations
      FROM products
      WHERE 
        product_name ILIKE ${'%' + query + '%'}
        OR product_code ILIKE ${'%' + query + '%'}
        OR category ILIKE ${'%' + query + '%'}
        OR manufacturer ILIKE ${'%' + query + '%'}
        OR status ILIKE ${'%' + query + '%'}
        OR observations ILIKE ${'%' + query + '%'};
    `;

    if (data.rows.length === 0) {
      return NextResponse.json({ error: 'No products found' }, { status: 404 });
    }

    return NextResponse.json(data.rows, { status: 200 });
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
