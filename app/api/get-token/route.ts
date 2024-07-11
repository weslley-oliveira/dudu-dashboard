import { NextResponse } from 'next/server';

export async function GET() {
  const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
  const clientSecret = process.env.NEXT_PUBLIC_CLIENT_SECRET;
  const tokenUrl = process.env.NEXT_PUBLIC_ACCESS_TOKEN_URL;
  const scope = process.env.NEXT_PUBLIC_API_SCOPE;

  if (!clientId || !clientSecret || !tokenUrl || !scope) {
    console.error('Missing required environment variables');
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: clientId,
    client_secret: clientSecret,
    scope: scope,
  });

  console.log('Token request details:');
  console.log('URL:', tokenUrl);
  console.log('Body:', body.toString());

  try {
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body,
    });

    const responseText = await response.text();
    console.log('Token response status:', response.status);
    console.log('Token response headers:', JSON.stringify(Object.fromEntries(response.headers), null, 2));
    console.log('Token response body:', responseText);

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to retrieve access token', details: responseText }, { status: response.status });
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Error parsing JSON response:', parseError);
      return NextResponse.json({ error: 'Invalid JSON response', details: responseText }, { status: 500 });
    }

    if (!data.access_token) {
      console.error('No access token in response');
      return NextResponse.json({ error: 'No access token in response', details: data }, { status: 500 });
    }

    console.log('Token retrieved successfully');
    return NextResponse.json({ access_token: data.access_token });
  } catch (error: unknown) {
    console.error('Error fetching access token:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'Internal Server Error', details: 'An unknown error occurred' }, { status: 500 });
    }
  }
}