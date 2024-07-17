import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const vehicleId = searchParams.get('vehicleId');

  if (!vehicleId) {
    return NextResponse.json({ error: 'Vehicle ID is required' }, { status: 400 });
  }

  const apiUrl = process.env.NEXT_PUBLIC_MOT_API_URL;
  const apiKey = process.env.NEXT_PUBLIC_MOT_API_KEY;
  const baseUrl = process.env.NEXTAUTH_URL;

  if (!apiUrl || !apiKey || !baseUrl) {
    return NextResponse.json({ error: 'Server configuration error', details: 'Missing required environment variables' }, { status: 500 });
  }

  try {
    const tokenResponse = await fetch(`${baseUrl}/api/gettoken?client_id=${process.env.NEXT_PUBLIC_MOT_CLIENT_ID}&client_secret=${process.env.NEXT_PUBLIC_MOT_CLIENT_SECRET}&tenantId=${process.env.NEXT_PUBLIC_MOT_TENANT_ID}`);
    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok || !tokenData.access_token) {
      return NextResponse.json({ 
        error: 'Failed to retrieve access token', 
        details: tokenData,
        status: tokenResponse.status 
      }, { status: tokenResponse.status });
    }

    const vehicleApiUrl = `${apiUrl}/${vehicleId}`;

    const vehicleResponse = await fetch(vehicleApiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'x-api-key': apiKey,
        'Accept': 'application/json',
      },
    });

    if (!vehicleResponse.ok) {
      const errorText = await vehicleResponse.json();
      let errorDetails = errorText;

      if (vehicleResponse.status === 403) {
        errorDetails = 'The API returned a 403 Forbidden error. Please check your API key and permissions.';
      }

      return NextResponse.json({ 
        error: 'Failed to fetch vehicle data', 
        details: errorDetails,
        status: vehicleResponse.status
      }, { status: vehicleResponse.status });
    }

    const vehicleData = await vehicleResponse.json();
    return NextResponse.json(vehicleData);
  } catch (error: unknown) {
    console.error('Error in get-vehicle-data:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ 
      error: 'Internal Server Error', 
      details: errorMessage,
      status: 500
    }, { status: 500 });
  }
}