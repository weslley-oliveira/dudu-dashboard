// app/api/token/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { client_id, client_secret, tenantId } = await req.json();

  const response = await fetch(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: client_id,
      client_secret: client_secret,
      scope: 'https://tapi.dvsa.gov.uk/.default',
    }),
  });

  const data = await response.json();

  return NextResponse.json(data);
}
