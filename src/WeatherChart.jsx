import { Box, Paper, Typography, ToggleButton, ToggleButtonGroup, Card, CardContent, Grid, Chip } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useState } from 'react';

export default function WeatherChart({ weatherData }) {
    const [chartType, setChartType] = useState('temperature');
    const [timeRange, setTimeRange] = useState('24h');

    // Mock data for demonstration - in a real app, this would come from API
    const generateMockData = () => {
        const data = [];
        const now = new Date();
        
        for (let i = 23; i >= 0; i--) {
            const time = new Date(now.getTime() - i * 60 * 60 * 1000);
            data.push({
                time: time.getHours() + ':00',
                temperature: Math.round(weatherData.temp + (Math.random() - 0.5) * 10),
                humidity: Math.round(weatherData.humidity + (Math.random() - 0.5) * 20),
                feelsLike: Math.round(weatherData.feelsLike + (Math.random() - 0.5) * 8)
            });
        }
        return data;
    };

    const chartData = generateMockData();

    const handleChartTypeChange = (event, newType) => {
        if (newType !== null) {
            setChartType(newType);
        }
    };

    const handleTimeRangeChange = (event, newRange) => {
        if (newRange !== null) {
            setTimeRange(newRange);
        }
    };

    const renderChart = () => {
        if (chartType === 'temperature') {
            return (
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Line 
                            type="monotone" 
                            dataKey="temperature" 
                            stroke="#2196F3" 
                            strokeWidth={3}
                            dot={{ fill: '#2196F3', strokeWidth: 2, r: 4 }}
                        />
                        <Line 
                            type="monotone" 
                            dataKey="feelsLike" 
                            stroke="#FF9800" 
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            dot={{ fill: '#FF9800', strokeWidth: 2, r: 3 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            );
        } else {
            return (
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="humidity" fill="#4CAF50" />
                    </BarChart>
                </ResponsiveContainer>
            );
        }
    };

    return (
        <Paper elevation={3} sx={{ p:4,  borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 4, textAlign: 'center', color: 'primary.main', fontWeight: 'bold' }}>
                Weather Analytics Dashboard
            </Typography>
            
            {/* Chart Type Toggle */}
            <Box sx={{ 
                mb: 4, 
                p: 3, 
                backgroundColor: 'grey.50', 
                borderRadius: 2,
                border: 1,
                borderColor: 'grey.200'
            }}>
                <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 2, fontWeight: 'medium' }}>
                    Chart Type:
                </Typography>
                <ToggleButtonGroup
                    value={chartType}
                    exclusive
                    onChange={handleChartTypeChange}
                    size="small"
                    sx={{
                        '& .MuiToggleButton-root': {
                            borderRadius: 2,
                            fontWeight: 'medium'
                        }
                    }}
                >
                    <ToggleButton value="temperature">Temperature</ToggleButton>
                    <ToggleButton value="humidity">Humidity</ToggleButton>
                </ToggleButtonGroup>
            </Box>

            {/* Time Range Toggle */}
            <Box sx={{ 
                mb: 4, 
                p: 3, 
                backgroundColor: 'grey.50', 
                borderRadius: 2,
                border: 1,
                borderColor: 'grey.200'
            }}>
                <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 2, fontWeight: 'medium' }}>
                    Time Range:
                </Typography>
                <ToggleButtonGroup
                    value={timeRange}
                    exclusive
                    onChange={handleTimeRangeChange}
                    size="small"
                    sx={{
                        '& .MuiToggleButton-root': {
                            borderRadius: 2,
                            fontWeight: 'medium'
                        }
                    }}
                >
                    <ToggleButton value="24h">24 Hours</ToggleButton>
                    <ToggleButton value="7d">7 Days</ToggleButton>
                    <ToggleButton value="30d">30 Days</ToggleButton>
                </ToggleButtonGroup>
            </Box>

            {/* Chart */}
            <Box sx={{ 
                height: 350, 
                p: 4, 
                backgroundColor: 'white', 
                borderRadius: 2,
                border: 1,
                borderColor: 'grey.200',
                boxShadow: 1,
                mb: 4
            }}>
                {renderChart()}
            </Box>

            {/* Chart Legend */}
            {chartType === 'temperature' && (
                <Box sx={{ 
                    mb: 4, 
                    p: 3, 
                    backgroundColor: 'grey.50', 
                    borderRadius: 2,
                    border: 1,
                    borderColor: 'grey.200',
                    display: 'flex', 
                    justifyContent: 'center', 
                    gap: 4 
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 20, height: 4, backgroundColor: '#2196F3', borderRadius: 2 }} />
                        <Typography variant="body2" fontWeight="medium">Actual Temperature</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 20, height: 4, backgroundColor: '#FF9800', borderRadius: 2 }} />
                        <Typography variant="body2" fontWeight="medium">Feels Like</Typography>
                    </Box>
                </Box>
            )}

            {/* Summary Stats */}
            <Box sx={{ 
                p: 4, 
                backgroundColor: 'grey.50', 
                borderRadius: 2,
                border: 1,
                borderColor: 'grey.200'
            }}>
                <Typography variant="subtitle2" gutterBottom color="primary" sx={{ mb: 4, textAlign: 'center', fontWeight: 'bold' }}>
                    Summary Statistics
                </Typography>
                <Grid container spacing={3} sx={{ textAlign: 'center' }}>
                    <Grid item xs={12} sm={4}>
                        <Card sx={{ 
                            p: 3, 
                            backgroundColor: 'white',
                            transition: 'all 0.3s ease-in-out',
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: 3
                            }
                        }}>
                            <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>
                                {Math.round(chartData.reduce((sum, item) => sum + item.temperature, 0) / chartData.length)}{"\u00b0"}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'medium' }}>
                                Average Temperature
                            </Typography>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Card sx={{ 
                            p: 3, 
                            backgroundColor: 'white',
                            transition: 'all 0.3s ease-in-out',
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: 3
                            }
                        }}>
                            <Typography variant="h5" color="secondary" sx={{ fontWeight: 'bold' }}>
                                {Math.max(...chartData.map(item => item.temperature))}{"\u00b0"}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'medium' }}>
                                Maximum Temperature
                            </Typography>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Card sx={{ 
                            p: 3, 
                            backgroundColor: 'white',
                            transition: 'all 0.3s ease-in-out',
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: 3
                            }
                        }}>
                            <Typography variant="h5" color="info.main" sx={{ fontWeight: 'bold' }}>
                                {Math.min(...chartData.map(item => item.temperature))}{"\u00b0"}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'medium' }}>
                                Minimum Temperature
                            </Typography>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </Paper>
    );
}
