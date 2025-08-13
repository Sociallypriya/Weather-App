
import SearchBox from "./SearchBox"
import InfoBox from "./InfoBox"
import WeatherChart from "./WeatherChart"
import WeatherForecast from "./WeatherForecast"
import { useState, useEffect } from "react"
import { Box, Container, Typography, Chip, IconButton, Tooltip, Snackbar, Alert, Paper } from '@mui/material'
import { Favorite, FavoriteBorder, Refresh, Settings, NavigateNext, NavigateBefore } from '@mui/icons-material'
import UnitToggle from "./UnitToggle"

export default function WeatherApp(){
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
    const [favorites, setFavorites] = useState([]);
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

    // Load favorites from localStorage on component mount
    useEffect(() => {
        const savedFavorites = localStorage.getItem('weatherFavorites');
        if (savedFavorites) {
            setFavorites(JSON.parse(savedFavorites));
        }
    }, []);

    // Save favorites to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('weatherFavorites', JSON.stringify(favorites));
    }, [favorites]);

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
    }, []);

    let updateInfo = async (newInfo) => {
        setLoading(true);
        try {
            // Simulate API delay for better UX
            await new Promise(resolve => setTimeout(resolve, 1000));
            setWeatherInfo(newInfo);
            setShowAlert(true);
            setAlertMessage(`Weather updated for ${newInfo.city}!`);
            setAlertType('success');
        } catch (error) {
            setShowAlert(true);
            setAlertMessage('Failed to update weather information');
            setAlertType('error');
        } finally {
            setLoading(false);
        }
    };

    const toggleFavorite = () => {
        const cityName = weatherInfo.city;
        if (favorites.includes(cityName)) {
            setFavorites(favorites.filter(city => city !== cityName));
            setShowAlert(true);
            setAlertMessage(`${cityName} removed from favorites`);
            setAlertType('info');
        } else {
            setFavorites([...favorites, cityName]);
            setShowAlert(true);
            setAlertMessage(`${cityName} added to favorites`);
            setAlertType('success');
        }
    };

    const loadFavoriteCity = async (cityName) => {
        // This would typically call the weather API for the favorite city
        setShowAlert(true);
        setAlertMessage(`Loading weather for ${cityName}...`);
        setAlertType('info');
    };

    const handleCloseAlert = () => {
        setShowAlert(false);
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const isFavorite = favorites.includes(weatherInfo.city);

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
                        
                        <Box sx={{ position: 'relative', width: '100%' }}>
                            <InfoBox 
                                info={weatherInfo} 
                                unit={unit}
                                loading={loading}
                            />
                            
                            {/* Interactive Controls Overlay */}
                            <Box sx={{ 
                                position: 'absolute', 
                                top: 16, 
                                right: 16, 
                                display: 'flex', 
                                gap: 1 
                            }}>
                                <Tooltip title={isFavorite ? "Remove from favorites" : "Add to favorites"}>
                                    <IconButton 
                                        onClick={toggleFavorite}
                                        sx={{ 
                                            backgroundColor: 'rgba(255,255,255,0.9)',
                                            '&:hover': { backgroundColor: 'rgba(255,255,255,1)' }
                                        }}
                                    >
                                        {isFavorite ? <Favorite color="error" /> : <FavoriteBorder />}
                                    </IconButton>
                                </Tooltip>
                                
                                <Tooltip title="Refresh weather">
                                    <IconButton 
                                        onClick={() => updateInfo(weatherInfo)}
                                        disabled={loading}
                                        sx={{ 
                                            backgroundColor: 'rgba(255,255,255,0.9)',
                                            '&:hover': { backgroundColor: 'rgba(255,255,255,1)' }
                                        }}
                                    >
                                        <Refresh />
                                    </IconButton>
                                </Tooltip>
                            </Box>
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
                
                {/* Favorites Display */}
                {favorites.length > 0 && (
                    <Box sx={{ mt: 3, display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
                        <Typography variant="body2" sx={{ width: '100%', mb: 1, color: 'text.secondary' }}>
                            Favorite Cities:
                        </Typography>
                        {favorites.map((city) => (
                            <Chip
                                key={city}
                                label={city}
                                onClick={() => loadFavoriteCity(city)}
                                sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'primary.light' } }}
                            />
                        ))}
                    </Box>
                )}
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
                <Tooltip title="Previous (←)">
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

                <Tooltip title="Next (→)">
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
                    px: 4,
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
