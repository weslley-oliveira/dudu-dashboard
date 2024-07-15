// app/api/gettoken/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const client_id = searchParams.get('client_id');
  const client_secret = searchParams.get('client_secret');
  const tenantId = searchParams.get('tenantId');

  if (!client_id || !client_secret || !tenantId) {
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
  }

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
