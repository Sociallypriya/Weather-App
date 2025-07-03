import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import SunnyIcon from '@mui/icons-material/Sunny';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';
export default function InfoBox({info}){
    const INIT_URL ="https://media.istockphoto.com/id/140469297/photo/sandstorm-driving.webp?a=1&b=1&s=612x612&w=0&k=20&c=-WrjjAF7jLNTOBqWHKKVHGxAL9_AqTCTfeMoGMAkO2c=";
    const RAIN_URL ="https://media.istockphoto.com/id/498063665/photo/rainy-landscape.webp?a=1&b=1&s=612x612&w=0&k=20&c=hOE6L7f7OoSKUW1Q4tR27GoEkOU_ywKJGCvSO77SeZg=";
    const HOT_URL = "https://media.istockphoto.com/id/1332108668/photo/heatwave-with-warm-thermometer-and-fire-global-warming-and-extreme-climate-environment.webp?a=1&b=1&s=612x612&w=0&k=20&c=TD95uCJmBIrWzvqYSoG5v1bb0gbaUXof4RN8xWop_qg=";
    const COLD_URL = "https://images.unsplash.com/photo-1564314968303-86c5df2b9a4c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Y29sZCUyMHdlYXRoZXJ8ZW58MHx8MHx8fDA%3D";
    return (
        <div className="InfoBox">
            <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        sx={{ height: 140 }}
        image={
            info.humidity>80
            ?RAIN_URL
            :info.temp>15
            ?HOT_URL
            :COLD_URL
        }
        title="green iguana"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {info.city} {
            info.humidity > 80
            ? <ThunderstormIcon />
            : info.temp > 15
            ? <SunnyIcon />
            : <AcUnitIcon />
        }

        </Typography>
        <Typography variant="body2"  color= 'text.secondary' component={"span"}>
          <p>Temperature={info.temp}&deg;C</p>
          <p>Humidity={info.humidity}</p>
          <p>Min Temperature={info.tempMin}&deg;C</p>
          <p>Max Temperature={info.tempMax}&deg;C</p>
          <p>The Weather can be described as <i>{info.weather}</i> and feels like {info.feelslike}</p>
        </Typography>
      </CardContent>
    </Card>
        </div>
    )
}