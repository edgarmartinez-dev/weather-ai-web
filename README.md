# Weather App

A simple and elegant weather application built with Next.js, TypeScript, and Tailwind CSS. Get real-time weather information for any city around the world.

## Features

- **Automatic Location Detection** - Automatically detects your location on page load/reload
- **Manual Location Detection** - "Use My Location" button to re-detect your location
- Search weather by city name
- Real-time weather data from OpenWeatherMap API
- Beautiful gradient UI with responsive design
- Display temperature, weather conditions, humidity, and wind speed
- Weather icons for visual representation

## Screenshots

The app features a clean, modern interface with:
- City search input
- Current temperature display
- Weather condition description
- Humidity and wind speed metrics
- Dynamic weather icons

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (version 18 or higher)
- npm or yarn package manager

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd weather-ai-web
```

### 2. Install dependencies

```bash
npm install
```

### 3. Get your OpenWeatherMap API Key

1. Go to [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Generate an API key

### 4. Configure environment variables

Create a `.env.local` file in the root directory:

```bash
cp .env.local.example .env.local
```

Then edit `.env.local` and add your API key:

```
OPENWEATHER_API_KEY=your_api_key_here
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

The app will automatically detect your location and display the weather when you first visit or reload the page.

**Automatic Location Detection:**
- When you visit the page, your browser will ask for permission to access your location
- Grant permission and the app will automatically show your local weather

**Manual Search:**
1. Enter a city name in the search box
2. Click the "Search" button or press Enter
3. View the current weather information for that city

**Re-detect Location:**
- Click the "Use My Location" button to detect your location again at any time

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **API**: OpenWeatherMap API

## Project Structure

```
weather-ai-web/
├── app/
│   ├── api/
│   │   ├── weather/
│   │   │   └── route.ts              # Weather API endpoint (by city)
│   │   └── weather-by-coords/
│   │       └── route.ts              # Weather API endpoint (by coordinates)
│   ├── globals.css                   # Global styles
│   ├── layout.tsx                    # Root layout
│   └── page.tsx                      # Main weather page with geolocation
├── public/                           # Static assets
├── .env.local.example                # Environment variables template
├── next.config.ts                    # Next.js configuration
├── tailwind.config.ts                # Tailwind CSS configuration
├── tsconfig.json                     # TypeScript configuration
└── package.json                      # Project dependencies
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## API Endpoints

### GET /api/weather

Fetch weather data for a specific city.

**Query Parameters:**
- `city` (string, required) - The name of the city

**Response:**
```json
{
  "location": "London",
  "temperature": 15.5,
  "description": "clear sky",
  "humidity": 72,
  "windSpeed": 3.5,
  "icon": "01d"
}
```

### GET /api/weather-by-coords

Fetch weather data for specific geographic coordinates.

**Query Parameters:**
- `lat` (number, required) - Latitude
- `lon` (number, required) - Longitude

**Response:**
```json
{
  "location": "London",
  "temperature": 15.5,
  "description": "clear sky",
  "humidity": 72,
  "windSpeed": 3.5,
  "icon": "01d"
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the ISC License.

## Acknowledgments

- Weather data provided by [OpenWeatherMap](https://openweathermap.org/)
- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
