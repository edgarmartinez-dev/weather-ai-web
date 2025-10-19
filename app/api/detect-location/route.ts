import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Use ip-api.com - free, no API key needed, 45 requests/minute
    // For localhost/development, it will automatically detect the server's public IP
    const geoResponse = await fetch('http://ip-api.com/json/');

    if (!geoResponse.ok) {
      throw new Error('Failed to fetch location data');
    }

    const geoData = await geoResponse.json();

    // Check if we got valid data
    if (geoData.status === 'fail') {
      throw new Error(geoData.message || 'Failed to detect location');
    }

    return NextResponse.json({
      city: geoData.city,
      region: geoData.regionName,
      country: geoData.country,
      latitude: geoData.lat,
      longitude: geoData.lon,
    });
  } catch (error) {
    console.error('IP Geolocation error:', error);
    return NextResponse.json(
      { error: 'Failed to detect location from IP' },
      { status: 500 }
    );
  }
}
