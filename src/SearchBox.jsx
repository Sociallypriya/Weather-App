import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useState, useEffect } from 'react';
import { Box, Autocomplete, CircularProgress, Alert, Paper, Typography, Chip, Card, Grid } from '@mui/material';
import { Search, LocationOn, TrendingUp } from '@mui/icons-material';

export default function SearchBox({updateInfo, loading}){
    let [city, setCity] = useState("");
    let [error,setError] = useState(false);
    let [errorMessage, setErrorMessage] = useState("");
    let [suggestions, setSuggestions] = useState([]);
    let [recentSearches, setRecentSearches] = useState([]);
    const API_URL = "https://api.openweathermap.org/data/2.5/weather";
    const API_KEY = "531f7f201f3003f22315f9d6b07ebb7e";

    // Load recent searches from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('recentSearches');
        if (saved) {
            setRecentSearches(JSON.parse(saved));
        }
    }, []);

    // Save recent searches to localStorage
    useEffect(() => {
        localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
    }, [recentSearches]);

    // Popular cities for suggestions
    const popularCities = [
        "London", "New York", "Tokyo", "Paris", "Sydney", "Mumbai", 
        "Beijing", "Cairo", "Rio de Janeiro", "Moscow", "Toronto", "Berlin"
    ];

    let getWeatherInfo = async(cityName) => {
        try{
            let response = await fetch(
                `${API_URL}?q=${cityName}&appid=${API_KEY}&units=metric`
            );
            
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error("City not found. Please check the spelling.");
                } else if (response.status === 401) {
                    throw new Error("API key error. Please contact support.");
                } else {
                    throw new Error("Failed to fetch weather data. Please try again.");
                }
            }
            
            let jsonResponse = await response.json();
            let result = {
                city: cityName,
                temp: jsonResponse.main.temp,
                tempMin: jsonResponse.main.temp_min,
                tempMax: jsonResponse.main.temp_max,
                humidity: jsonResponse.main.humidity,
                feelsLike: jsonResponse.main.feels_like,
                weather: jsonResponse.weather[0].description,
            };
            
            // Add to recent searches
            addToRecentSearches(cityName);
            
            return result;
        }catch(err){
            throw err; 
        }
    };

    const addToRecentSearches = (cityName) => {
        setRecentSearches(prev => {
            const filtered = prev.filter(city => city !== cityName);
            return [cityName, ...filtered].slice(0, 5); // Keep only last 5
        });
    };

    let handleChange = (evt, newValue) => {
        if (typeof newValue === 'string') {
            setCity(newValue);
        } else if (newValue) {
            setCity(newValue);
        }
        setError(false);
        setErrorMessage("");
    };

    let handleSubmit = async(evt) => {
        try{
            evt.preventDefault();
            if (!city.trim()) {
                setError(true);
                setErrorMessage("Please enter a city name");
                return;
            }
            
            setError(false);
            setErrorMessage("");
            let newInfo = await getWeatherInfo(city);
            updateInfo(newInfo);
            setCity("");
        }catch(err){
            setError(true);
            setErrorMessage(err.message || "An error occurred");
        }
    }

    const handleQuickSearch = async (cityName) => {
        try {
            setError(false);
            setErrorMessage("");
            let newInfo = await getWeatherInfo(cityName);
            updateInfo(newInfo);
        } catch (err) {
            setError(true);
            setErrorMessage(err.message || "An error occurred");
        }
    };

    return (
        <Box sx={{ 
            width: '100%',
            maxWidth: 600,
            mx: 'auto'
        }}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                    <Search color="primary" />
                    Search Weather
                </Typography>
                
                <form onSubmit={handleSubmit}>
                    <Autocomplete
                        freeSolo
                        options={[...popularCities, ...recentSearches]}
                        value={city}
                        onChange={handleChange}
                        onInputChange={(event, newInputValue) => {
                            setCity(newInputValue);
                        }}
                        renderInput={(params) => (
                            <TextField 
                                {...params}
                                label="Enter City Name" 
                                variant="outlined" 
                                required 
                                fullWidth
                                error={error}
                                helperText={error ? errorMessage : "Type a city name or select from suggestions"}
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                        <>
                                            {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                            {params.InputProps.endAdornment}
                                        </>
                                    ),
                                }}
                            />
                        )}
                        renderOption={(props, option) => (
                            <Box component="li" {...props}>
                                <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />
                                {option}
                            </Box>
                        )}
                        sx={{ mb: 3 }}
                    />
                    
                    <Button 
                        variant="contained" 
                        type='submit' 
                        fullWidth
                        disabled={loading || !city.trim()}
                        sx={{ 
                            py: 1.5,
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            borderRadius: 2
                        }}
                    >
                        {loading ? <CircularProgress size={20} color="inherit" /> : 'Get Weather'}
                    </Button>
                </form>

                {/* Quick Access Section */}
                <Box sx={{ 
                    mt: 3, 
                    p: 3, 
                    backgroundColor: 'grey.50', 
                    borderRadius: 2,
                    border: 1,
                    borderColor: 'grey.200'
                }}>
                    <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <TrendingUp color="primary" />
                        Quick Access
                    </Typography>
                    
                    {/* Recent Searches */}
                    {recentSearches.length > 0 && (
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                                Recent Searches:
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {recentSearches.map((city) => (
                                    <Chip
                                        key={city}
                                        label={city}
                                        size="small"
                                        onClick={() => handleQuickSearch(city)}
                                        sx={{ cursor: 'pointer' }}
                                    />
                                ))}
                            </Box>
                        </Box>
                    )}
                    
                    {/* Popular Cities */}
                    <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                            Popular Cities:
                        </Typography>
                        <Grid container spacing={1}>
                            {popularCities.slice(0, 6).map((city) => (
                                <Grid item xs={6} sm={4} key={city}>
                                    <Card sx={{ 
                                        p: 1.5, 
                                        backgroundColor: 'white',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease-in-out',
                                        '&:hover': {
                                            transform: 'scale(1.02)',
                                            boxShadow: 3
                                        }
                                    }} onClick={() => handleQuickSearch(city)}>
                                        <Typography variant="caption" sx={{ textAlign: 'center', display: 'block' }}>
                                            {city}
                                        </Typography>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </Box>
            </Paper>
        </Box>
    )
}