# Weather App

A responsive weather dashboard built with React, Vite, and Material UI. The app lets users search for a city, view current weather conditions, switch between Celsius and Fahrenheit, and browse extra analytics and forecast-style views in a slide-based interface.

## Features

- Search weather by city using the OpenWeatherMap API
- View current temperature, feels-like temperature, humidity, and min/max values
- Toggle temperature units between Celsius and Fahrenheit
- Refresh the currently selected city's weather
- Use recent searches stored in `localStorage`
- Browse the app with navigation arrows, dots, or keyboard arrow keys
- Explore analytics and forecast screens with a polished Material UI layout

## Tech Stack

- React 19
- Vite 6
- Material UI
- Recharts
- OpenWeatherMap API

## Project Structure

```text
mini-project-react/
|-- public/
|-- src/
|   |-- App.jsx
|   |-- WeatherApp.jsx
|   |-- SearchBox.jsx
|   |-- InfoBox.jsx
|   |-- WeatherChart.jsx
|   |-- WeatherForecast.jsx
|   |-- UnitToggle.jsx
|-- .env
|-- package.json
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Add your API key

Create a `.env` file in the project root and add:

```env
VITE_WEATHER_API_KEY=your_openweathermap_api_key
```

### 3. Start the development server

```bash
npm run dev
```

Then open the local Vite URL shown in the terminal.

## Available Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## How It Works

- `WeatherApp.jsx` manages the main layout, slide navigation, alerts, unit selection, and refresh flow.
- `SearchBox.jsx` handles city search, validation, and recent-search storage.
- `InfoBox.jsx` displays the current weather card and detailed conditions.
- `WeatherChart.jsx` shows a visual analytics dashboard based on generated demo data.
- `WeatherForecast.jsx` shows a 5-day style forecast view based on generated demo data.

## Important Notes

- Current weather data comes from the OpenWeatherMap API.
- The analytics chart and 5-day forecast currently use mock/generated data derived from the selected city's weather.
- The `.env` file is ignored by Git, so your API key stays out of version control.

## Build Status

The project builds successfully with:

```bash
npm run build
```

Vite may still show a bundle-size warning for the generated JavaScript output, but the app compiles correctly.
