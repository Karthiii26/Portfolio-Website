export default async function handler(req, res) {
    const { lat, lon } = req.query;

    const API_KEY = process.env.WEATHER_API_KEY;

    if (!API_KEY) {
        return res.status(500).json({ error: 'Server configuration error: API Key missing' });
    }

    if (!lat || !lon) {
        return res.status(400).json({ error: 'Missing coordinates' });
    }

    try {
        const fetchResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`);
        
        if (!fetchResponse.ok) {
            throw new Error(`Weather API returned ${fetchResponse.status}`);
        }
        
        const data = await fetchResponse.json();
        
        res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
