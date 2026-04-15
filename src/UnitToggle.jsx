import { ToggleButton, ToggleButtonGroup, Typography, Box } from '@mui/material';
import { Thermostat } from '@mui/icons-material';

export default function UnitToggle({ unit, setUnit }) {
    const handleUnitChange = (event, newUnit) => {
        if (newUnit !== null) {
            setUnit(newUnit);
        }
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'center' }}>
            <Thermostat color="primary" />
            <Typography variant="body2" color="text.secondary">
                Temperature Unit:
            </Typography>
            <ToggleButtonGroup
                value={unit}
                exclusive
                onChange={handleUnitChange}
                aria-label="temperature unit"
                size="small"
                sx={{
                    '& .MuiToggleButton-root': {
                        px: 2,
                        py: 0.5,
                        fontWeight: 'bold',
                        '&.Mui-selected': {
                            backgroundColor: 'primary.main',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: 'primary.dark',
                            }
                        }
                    }
                }}
            >
                <ToggleButton value="celsius" aria-label="celsius">
                    {"\u00b0"}C
                </ToggleButton>
                <ToggleButton value="fahrenheit" aria-label="fahrenheit">
                    {"\u00b0"}F
                </ToggleButton>
            </ToggleButtonGroup>
        </Box>
    );
}
