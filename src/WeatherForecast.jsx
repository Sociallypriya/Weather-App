import { Box, Paper, Typography, Card, CardContent, Grid, Chip, IconButton, Tooltip } from '@mui/material';
import { 
    WbSunny, 
    AcUnit, 
    Thunderstorm, 
    Cloud, 
    Opacity, 
    Thermostat,
    Visibility,
    Air
} from '@mui/icons-material';
import { useState } from 'react';

export default function WeatherForecast({ currentWeather }) {
    const [selectedDay, setSelectedDay] = useState(0);

    // Mock forecast data - in a real app, this would come from API
    const generateForecastData = () => {
        const days = ['Today', 'Tomorrow', 'Wednesday', 'Thursday', 'Friday'];
        const forecast = [];
        
        for (let i = 0; i < 5; i++) {
            const baseTemp = currentWeather.temp + (Math.random() - 0.5) * 15;
            const weatherTypes = ['sunny', 'cloudy', 'rainy', 'partly cloudy', 'clear'];
            const weather = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
            
            forecast.push({
                day: days[i],
                date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                }),
                high: Math.round(baseTemp + 5),
                low: Math.round(baseTemp - 5),
                weather: weather,
                humidity: Math.round(currentWeather.humidity + (Math.random() - 0.5) * 20),
                windSpeed: Math.round(5 + Math.random() * 20),
                visibility: Math.round(8 + Math.random() * 4)
            });
        }
        return forecast;
    };

    const forecastData = generateForecastData();

    const getWeatherIcon = (weather, size = 24) => {
        const iconProps = { sx: { fontSize: size, color: 'primary.main' } };
        
        switch (weather.toLowerCase()) {
            case 'sunny':
            case 'clear':
                return <WbSunny {...iconProps} />;
            case 'rainy':
            case 'stormy':
                return <Thunderstorm {...iconProps} />;
            case 'snowy':
            case 'icy':
                return <AcUnit {...iconProps} />;
            case 'cloudy':
            case 'partly cloudy':
                return <Cloud {...iconProps} />;
            default:
                return <WbSunny {...iconProps} />;
        }
    };

    const getWeatherColor = (weather) => {
        switch (weather.toLowerCase()) {
            case 'sunny':
            case 'clear':
                return '#FF9800';
            case 'rainy':
            case 'stormy':
                return '#2196F3';
            case 'snowy':
            case 'icy':
                return '#03A9F4';
            case 'cloudy':
            case 'partly cloudy':
                return '#9E9E9E';
            default:
                return '#2196F3';
        }
    };

    const handleDaySelect = (index) => {
        setSelectedDay(index);
    };

    return (
        <Paper elevation={3} sx={{ p: 3, mt: 3, borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                5-Day Weather Forecast
            </Typography>

            {/* Daily Forecast Cards */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                {forecastData.map((day, index) => (
                    <Grid item xs={12} sm={6} md={2.4} key={index}>
                        <Card 
                            sx={{ 
                                cursor: 'pointer',
                                transition: 'all 0.3s ease-in-out',
                                transform: selectedDay === index ? 'scale(1.05)' : 'scale(1)',
                                boxShadow: selectedDay === index ? 4 : 1,
                                border: selectedDay === index ? 2 : 0,
                                borderColor: 'primary.main',
                                '&:hover': {
                                    transform: 'scale(1.02)',
                                    boxShadow: 3
                                }
                            }}
                            onClick={() => handleDaySelect(index)}
                        >
                            <CardContent sx={{ textAlign: 'center', p: 2 }}>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    {day.day}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {day.date}
                                </Typography>
                                
                                <Box sx={{ my: 1 }}>
                                    {getWeatherIcon(day.weather, 32)}
                                </Box>
                                
                                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                                    {day.high}°
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {day.low}°
                                </Typography>
                                
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                                    {day.weather}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Detailed Day Information */}
            <Box sx={{ 
                p: 3, 
                backgroundColor: 'grey.50', 
                borderRadius: 2,
                border: 1,
                borderColor: 'grey.200'
            }}>
                <Typography variant="h6" gutterBottom sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    color: getWeatherColor(forecastData[selectedDay].weather)
                }}>
                    {getWeatherIcon(forecastData[selectedDay].weather, 28)}
                    {forecastData[selectedDay].day} - {forecastData[selectedDay].weather}
                </Typography>
                
                <Grid container spacing={3} sx={{ mt: 2 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Thermostat color="primary" />
                            <Typography variant="body2">Temperature Range</Typography>
                        </Box>
                        <Typography variant="h6" color="primary">
                            {forecastData[selectedDay].low}° - {forecastData[selectedDay].high}°
                        </Typography>
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={3}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Opacity color="primary" />
                            <Typography variant="body2">Humidity</Typography>
                        </Box>
                        <Typography variant="h6" color="primary">
                            {forecastData[selectedDay].humidity}%
                        </Typography>
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={3}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Air color="primary" />
                            <Typography variant="body2">Wind Speed</Typography>
                        </Box>
                        <Typography variant="h6" color="primary">
                            {forecastData[selectedDay].windSpeed} km/h
                        </Typography>
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={3}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Visibility color="primary" />
                            <Typography variant="body2">Visibility</Typography>
                        </Box>
                        <Typography variant="h6" color="primary">
                            {forecastData[selectedDay].visibility} km
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
        </Paper>
    );
}
