import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const vehicleId = searchParams.get('vehicleId');

  console.log('Received request for vehicle data. Vehicle ID:', vehicleId);

  if (!vehicleId) { 
    console.error('No vehicle ID provided');
    return NextResponse.json({ error: 'Vehicle ID is required' }, { status: 400 });
  }

  const apiUrl = process.env.NEXT_PUBLIC_MOT_API_URL;
  const apiKey = process.env.NEXT_PUBLIC_MOT_API_KEY;
  const baseUrl = process.env.NEXTAUTH_URL;

  console.log('Environment variables:');
  console.log('API URL:', apiUrl);
  console.log('API Key:', apiKey ? '[REDACTED]' : 'Not set');
  console.log('Base URL:', baseUrl);

  if (!apiUrl || !apiKey || !baseUrl) {
    console.error('Missing required environment variables');
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  try {
    console.log('Attempting to get access token');
    const tokenResponse = await fetch(`${baseUrl}/api/gettoken?client_id=${process.env.NEXT_PUBLIC_MOT_CLIENT_ID}&client_secret=${process.env.NEXT_PUBLIC_MOT_CLIENT_SECRET}&tenantId=${process.env.NEXT_PUBLIC_MOT_TENANT_ID}`);
    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok || !tokenData.access_token) {
      console.error('Failed to retrieve access token:');
      return NextResponse.json({ error: 'Failed to retrieve access token', details: tokenData }, { status: tokenResponse.status });
    }

    console.log('Access token retrieved successfully');

    const vehicleApiUrl = `${apiUrl}/${vehicleId}`;

    const vehicleResponse = await fetch(vehicleApiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'x-api-key': apiKey,
        'Accept': 'application/json',
      },
    });

    console.log('Vehicle API response status:', vehicleResponse.status);

    if (!vehicleResponse.ok) {
      const errorText = await vehicleResponse.text();
      console.error('Failed to fetch vehicle data. Status:', vehicleResponse.status, 'Response:', errorText);

      if (vehicleResponse.status === 403) {
        console.error('Access Denied: Check your API key and permissions.');
        return NextResponse.json({
          error: 'Permission Denied',
          details: 'The API returned a 403 Forbidden error. Please check your API key and permissions.',
          apiResponse: errorText,
        }, { status: 403 });
      }

      return NextResponse.json({ error: 'Failed to fetch vehicle data', details: errorText }, { status: vehicleResponse.status });
    }

    const vehicleData = await vehicleResponse.json();
    console.log('Vehicle data fetched successfully');
    return NextResponse.json(vehicleData);
  } catch (error: unknown) {
    console.error('Error in get-vehicle-data:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Unknown Error', details: 'An unknown error occurred' }, { status: 500 });
  }
}
