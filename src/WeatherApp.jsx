
import SearchBox from "./SearchBox"
import InfoBox from "./InfoBox"
import WeatherChart from "./WeatherChart"
import WeatherForecast from "./WeatherForecast"
import { useState, useEffect, useCallback } from "react"
import { Box, Container, Typography, IconButton, Tooltip, Snackbar, Alert, Paper } from '@mui/material'
import { NavigateNext, NavigateBefore } from '@mui/icons-material'
import UnitToggle from "./UnitToggle"

export default function WeatherApp(){
    const API_URL = "https://api.openweathermap.org/data/2.5/weather";
    const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

    const [weatherInfo,setWeatherInfo]=useState({
        city: "Wanderland",
        feelsLike: 24.84,
        temp: 25.05,
        tempMin:25.05,
        tempMax: 25.05,
        humidity: 47,
        weather: "haze",
    });
    
    const [loading, setLoading] = useState(false);
    const [unit, setUnit] = useState('celsius');
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('info');
    const [currentSlide, setCurrentSlide] = useState(0);

    // Define slides
    const slides = [
        { id: 'search', title: 'Search & Current Weather', component: 'search' },
        { id: 'chart', title: 'Weather Analytics', component: 'chart' },
        { id: 'forecast', title: '5-Day Forecast', component: 'forecast' }
    ];
    const slideCount = slides.length;

    const nextSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev + 1) % slideCount);
    }, [slideCount]);

    const prevSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev - 1 + slideCount) % slideCount);
    }, [slideCount]);

    const showStatus = (message, type = 'info') => {
        setAlertMessage(message);
        setAlertType(type);
        setShowAlert(true);
    };

    const getWeatherInfo = async (cityName) => {
        const trimmedCity = cityName.trim();
        const response = await fetch(
            `${API_URL}?q=${trimmedCity}&appid=${API_KEY}&units=metric`
        );

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error("City not found. Please check the spelling.");
            }
            if (response.status === 401) {
                throw new Error("API key error. Please contact support.");
            }
            throw new Error("Failed to fetch weather data. Please try again.");
        }

        const jsonResponse = await response.json();
        return {
            city: jsonResponse.name || trimmedCity,
            temp: jsonResponse.main.temp,
            tempMin: jsonResponse.main.temp_min,
            tempMax: jsonResponse.main.temp_max,
            humidity: jsonResponse.main.humidity,
            feelsLike: jsonResponse.main.feels_like,
            weather: jsonResponse.weather[0].description,
        };
    };

    // Keyboard navigation
    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.key === 'ArrowRight') {
                nextSlide();
            } else if (event.key === 'ArrowLeft') {
                prevSlide();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [nextSlide, prevSlide]);

    let updateInfo = async (newInfo) => {
        setLoading(true);
        try {
            // Simulate API delay for better UX
            await new Promise(resolve => setTimeout(resolve, 1000));
            setWeatherInfo(newInfo);
            showStatus(`Weather updated for ${newInfo.city}!`, 'success');
        } catch {
            showStatus('Failed to update weather information', 'error');
        } finally {
            setLoading(false);
        }
    };

    const refreshWeather = async () => {
        setLoading(true);
        try {
            const newInfo = await getWeatherInfo(weatherInfo.city);
            setWeatherInfo(newInfo);
            showStatus(`Weather refreshed for ${newInfo.city}!`, 'success');
        } catch (error) {
            showStatus(error.message || 'Failed to refresh weather', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleCloseAlert = () => {
        setShowAlert(false);
    };

    const renderCurrentSlide = () => {
        switch (currentSlide) {
            case 0: // Search & Current Weather
                return (
                    <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center',
                        width: '100%',
                        maxWidth: 600,
                        mx: 'auto',
                        gap: 2
                    }}>
                        <SearchBox updateInfo={updateInfo} loading={loading} />
                        
                        <Box sx={{ width: '100%' }}>
                            <InfoBox 
                                info={weatherInfo} 
                                unit={unit}
                                loading={loading}
                                onRefresh={refreshWeather}
                            />
                        </Box>
                    </Box>
                );
            case 1: // Weather Chart
                return <WeatherChart weatherData={weatherInfo} />;
            case 2: // Weather Forecast
                return <WeatherForecast currentWeather={weatherInfo} />;
            default:
                return null;
        }
    };

    return(
             <Container maxWidth="md" sx={{ py: 4}}>

            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h2" component="h1" gutterBottom sx={{ 
                    fontWeight: 'bold',
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    Weather App
                </Typography>
                
                {/* Unit Toggle */}
                <UnitToggle unit={unit} setUnit={setUnit} />
                
            </Box>

            {/* Navigation Dots */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                {slides.map((slide, index) => (
                    <Box
                        key={slide.id}
                        onClick={() => setCurrentSlide(index)}
                        sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            backgroundColor: currentSlide === index ? 'primary.main' : 'grey.300',
                            mx: 0.5,
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                backgroundColor: currentSlide === index ? 'primary.dark' : 'grey.400',
                                transform: 'scale(1.2)',
                            }
                        }}
                    />
                ))}
            </Box>

            {/* Current Slide Title */}
            <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>
                    {slides[currentSlide].title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {currentSlide + 1} of {slides.length}
                </Typography>
            </Box>

            {/* Main Content Area */}
           <Paper 
                elevation={3} 
                sx={{ 
                    p: { xs: 2, sm: 3 },  // responsive padding
                    borderRadius: 3, 
                    minHeight: 400, 
                    position: 'relative',
                    mt: 2                 // margin-top for breathing space
                }}
            >

                {/* Navigation Arrows */}
                <Tooltip title="Previous (Left arrow)">
                    <IconButton
                        onClick={prevSlide}
                        sx={{
                            position: 'absolute',
                            left: 8,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            backgroundColor: 'rgba(255,255,255,0.9)',
                            zIndex: 1,
                            '&:hover': { backgroundColor: 'rgba(255,255,255,1)' }
                        }}
                    >
                        <NavigateBefore />
                    </IconButton>
                </Tooltip>

                <Tooltip title="Next (Right arrow)">
                    <IconButton
                        onClick={nextSlide}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            backgroundColor: 'rgba(255,255,255,0.9)',
                            zIndex: 1,
                            '&:hover': { backgroundColor: 'rgba(255,255,255,1)' }
                        }}
                    >
                        <NavigateNext />
                    </IconButton>
                </Tooltip>

                {/* Slide Content */}
                <Box sx={{ 
                    px: { xs: 0, sm: 4 },
                    display: 'flex',
                    justifyContent: 'center',
                    width: '100%'
                }}>
                    {renderCurrentSlide()}
                </Box>
            </Paper>

            {/* Alert Snackbar */}
            <Snackbar 
                open={showAlert} 
                autoHideDuration={3000} 
                onClose={handleCloseAlert}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseAlert} severity={alertType} sx={{ width: '100%' }}>
                    {alertMessage}
                </Alert>
            </Snackbar>
        </Container>
    )
}
