import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { Part } from '@/app/lib/parts/definitions';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json({ error: 'Invalid query parameter' }, { status: 400 });
  }

  try {
    const data = await sql<Part>`
      SELECT
        id,
        description,
        oem_number AS "oemNumber",
        part_number AS "partNumber",
        brand,
        unit_of_measurement AS "unitOfMeasurement",
        unit_price AS "unitPrice",
        quantity,
        company_id AS "companyId",
        product_url AS "productUrl",
        image_urls AS "imageUrls"
      FROM parts
      WHERE 
        description ILIKE ${'%' + query + '%'}
        OR oem_number ILIKE ${'%' + query + '%'}
        OR part_number ILIKE ${'%' + query + '%'}
        OR brand ILIKE ${'%' + query + '%'};
    `;

    if (data.rows.length === 0) {
      return NextResponse.json({ error: 'No parts found' }, { status: 404 });
    }

    return NextResponse.json(data.rows, { status: 200 });
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ error: 'Failed to fetch parts' }, { status: 500 });
  }
}