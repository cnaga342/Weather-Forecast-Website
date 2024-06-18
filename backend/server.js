const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.WEATHER_API_KEY;

// Default route for the root URL
app.get('/', (req, res) => {
    res.send('Welcome to the Weather Forecast API');
});

// Weather route
app.get('/weather', async (req, res) => {
    const { location } = req.query;
    if (!location) {
        return res.status(400).json({ error: "Location parameter is required" });
    }
    try {
        const response = await axios.get(`http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${location}&days=5`);
        res.json(response.data);
    } catch (error) {
        if (error.response) {
            if (error.response.status === 403) {
                res.status(403).json({ error: "Access to Weather API forbidden. Check your API key and permissions." });
            } else {
                res.status(error.response.status).json({ error: error.response.data });
            }
        } else if (error.request) {
            res.status(500).json({ error: "No response from server" });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
