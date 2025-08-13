import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Box, Skeleton, LinearProgress, Collapse, IconButton, Paper, Grid } from '@mui/material';
import { 
    AcUnit, 
    WbSunny, 
    Thunderstorm, 
    Opacity, 
    Thermostat,
    ExpandMore,
    ExpandLess
} from '@mui/icons-material';
import { useState } from 'react';

export default function InfoBox({info, unit, loading}){
    const [expanded, setExpanded] = useState(false);
    
    const INIT_URL ="https://media.istockphoto.com/id/140469297/photo/sandstorm-driving.webp?a=1&b=1&s=612x612&w=0&k=20&c=-WrjjAF7jLNTOBqWHKKVHGxAL9_AqTCTfeMoGMAkO2c=";
    const RAIN_URL ="https://media.istockphoto.com/id/498063665/photo/rainy-landscape.webp?a=1&b=1&s=612x612&w=0&k=20&c=hOE6L7f7OoSKUW1Q4tR27GoEkOU_ywKJGCvSO77SeZg=";
    const HOT_URL = "https://media.istockphoto.com/id/1332108668/photo/heatwave-with-warm-thermometer-and-fire-global-warming-and-extreme-climate-environment.webp?a=1&b=1&s=612x612&w=0&k=20&c=TD95uCJmBIrWzvqYSoG5v1bb0gbaUXof4RN8xWop_qg=";
    const COLD_URL = "https://images.unsplash.com/photo-1564314968303-86c5df2b9a4c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Y29sZCUyMHdlYXRoZXJ8ZW58MHx8MHx8fDA%3D";

    // Convert temperature based on unit
    const convertTemp = (temp) => {
        if (unit === 'fahrenheit') {
            return ((temp * 9/5) + 32).toFixed(1);
        }
        return temp.toFixed(1);
    };

    // Get weather icon based on conditions
    const getWeatherIcon = () => {
        const weather = info.weather.toLowerCase();
        const temp = info.temp;
        const humidity = info.humidity;

        if (weather.includes('rain') || weather.includes('drizzle') || humidity > 80) {
            return <Thunderstorm sx={{ fontSize: 40, color: 'primary.main' }} />;
        } else if (weather.includes('sun') || weather.includes('clear') || temp > 20) {
            return <WbSunny sx={{ fontSize: 40, color: 'orange' }} />;
        } else if (weather.includes('snow') || weather.includes('ice') || temp < 5) {
            return <AcUnit sx={{ fontSize: 40, color: 'blue' }} />;
        } else if (weather.includes('cloud') || weather.includes('overcast')) {
            return <WbSunny sx={{ fontSize: 40, color: 'grey' }} />;
        } else {
            return <WbSunny sx={{ fontSize: 40, color: 'primary.main' }} />;
        }
    };

    // Get background image based on weather
    const getBackgroundImage = () => {
        if (info.humidity > 80) return RAIN_URL;
        if (info.temp > 20) return HOT_URL;
        if (info.temp < 5) return COLD_URL;
        return INIT_URL;
    };

    // Get weather mood/description
    const getWeatherMood = () => {
        const temp = info.temp;
        if (temp > 25) return "Hot";
        if (temp > 20) return "Warm";
        if (temp > 15) return "Mild";
        if (temp > 10) return "Cool";
        if (temp > 0) return "Cold";
        return "Freezing";
    };

    if (loading) {
        return (
            <Card sx={{ maxWidth: 400, mx: 'auto' }}>
                <Skeleton variant="rectangular" height={200} />
                <CardContent>
                    <Skeleton variant="text" height={40} />
                    <Skeleton variant="text" height={20} />
                    <Skeleton variant="text" height={20} />
                    <Skeleton variant="text" height={20} />
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="InfoBox">
            <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
                <Card sx={{ 
                    maxWidth: 500, 
                    mx: 'auto',
                    position: 'relative',
                    overflow: 'visible',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 8
                    }
                }}>
                    <CardMedia
                        sx={{ 
                            height: 250,
                            position: 'relative',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}
                        image={getBackgroundImage()}
                        title="Weather Background"
                    >
                        {/* Weather Icon Overlay */}
                        <Box sx={{
                            position: 'absolute',
                            top: 10,
                            left: 8,
                            backgroundColor: 'rgba(255,255,255,0.9)',
                            borderRadius: '50%',
                            p: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            {getWeatherIcon()}
                        </Box>
                    </CardMedia>
                    
                    <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography gutterBottom variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                                {info.city}
                            </Typography>
                            <IconButton 
                                onClick={() => setExpanded(!expanded)}
                                size="small"
                            >
                                {expanded ? <ExpandLess /> : <ExpandMore />}
                            </IconButton>
                        </Box>

                        {/* Main Temperature Display */}
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h2" component="div" sx={{ 
                                fontWeight: 'bold',
                                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}>
                                {convertTemp(info.temp)}°{unit === 'fahrenheit' ? 'F' : 'C'}
                            </Typography>
                            <Typography variant="h6" color="text.secondary">
                                {getWeatherMood()} • {info.weather}
                            </Typography>
                        </Box>

                        {/* Weather Details */}
                        <Box sx={{ 
                            mb: 2, 
                            p: 3, 
                            backgroundColor: 'grey.50', 
                            borderRadius: 2,
                            border: 1,
                            borderColor: 'grey.200'
                        }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Thermostat color="primary" />
                                    <Typography variant="body2">Feels like</Typography>
                                </Box>
                                <Typography variant="body1" fontWeight="bold">
                                    {convertTemp(info.feelsLike)}°{unit === 'fahrenheit' ? 'F' : 'C'}
                                </Typography>
                            </Box>
                            
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Opacity color="primary" />
                                    <Typography variant="body2">Humidity</Typography>
                                </Box>
                                <Typography variant="body1" fontWeight="bold">
                                    {info.humidity}%
                                </Typography>
                            </Box>
                        </Box>

                        {/* Temperature Range */}
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ mb: 2 }}>
                                Temperature Range
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Card sx={{ p: 2, backgroundColor: 'grey.50', textAlign: 'center' }}>
                                        <Typography variant="h6" color="primary">
                                            {convertTemp(info.tempMin)}°{unit === 'fahrenheit' ? 'F' : 'C'}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Min Temperature
                                        </Typography>
                                    </Card>
                                </Grid>
                                <Grid item xs={6}>
                                    <Card sx={{ p: 2, backgroundColor: 'grey.50', textAlign: 'center' }}>
                                        <Typography variant="h6" color="secondary">
                                            {convertTemp(info.tempMax)}°{unit === 'fahrenheit' ? 'F' : 'C'}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Max Temperature
                                        </Typography>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Box>

                        {/* Expandable Additional Info */}
                        <Collapse in={expanded}>
                            <Box sx={{ 
                                mt: 3, 
                                pt: 3, 
                                p: 3, 
                                backgroundColor: 'grey.50', 
                                borderRadius: 2,
                                border: 1,
                                borderColor: 'grey.200',
                                borderTop: 1
                            }}>
                                <Typography variant="subtitle2" color="primary" gutterBottom sx={{ mb: 2 }}>
                                    Additional Information
                                </Typography>
                                
                                {/* Humidity Progress Bar */}
                                <Box sx={{ mb: 3 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="caption">Humidity Level</Typography>
                                        <Typography variant="caption">{info.humidity}%</Typography>
                                    </Box>
                                    <LinearProgress 
                                        variant="determinate" 
                                        value={info.humidity} 
                                        sx={{ height: 8, borderRadius: 4 }}
                                    />
                                </Box>

                                {/* Weather Description */}
                                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                    The weather can be described as <strong>{info.weather}</strong> and feels like {convertTemp(info.feelsLike)}°{unit === 'fahrenheit' ? 'F' : 'C'}.
                                </Typography>
                            </Box>
                        </Collapse>
                    </CardContent>
                </Card>
            </Paper>
        </div>
    )
}