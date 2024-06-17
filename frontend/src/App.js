import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Import your CSS file

function App() {
    const [location, setLocation] = useState('');
    const [weatherData, setWeatherData] = useState(null);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                setLocation(`${latitude},${longitude}`);
            });
        }
    }, []);

    useEffect(() => {
        if (location) {
            axios.get(`http://localhost:5000/weather`, { params: { location } })
                .then((response) => {
                    setWeatherData(response.data);
                })
                .catch((error) => console.error(error));
        }
    }, [location]);

    return (
        <div className="App">
            <h1 className="app-title">Weather Forecast</h1>
            <form onSubmit={(e) => { e.preventDefault(); }}>
                <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter location"
                    className="location-input"
                />
                <button type="submit" className="get-weather-btn">Get Weather</button>
            </form>
            {weatherData && (
                <div className="weather-container">
                    <h2 className="weather-heading">Weather for {weatherData.location.name}</h2>
                    {weatherData.forecast.forecastday.map((day) => (
                        <div key={day.date} className="weather-card">
                            <h3>{day.date}</h3>
                            <p>{day.day.condition.text}</p>
                            <p>Max Temp: {day.day.maxtemp_c}°C</p>
                            <p>Min Temp: {day.day.mintemp_c}°C</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default App;
