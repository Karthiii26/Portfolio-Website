export default async function handler(req, res) {
  const { handle } = req.query;

  if (!handle) {
    return res.status(400).json({ error: 'Handle is required' });
  }

  try {
    const response = await fetch(`https://www.codechef.com/users/${handle}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const html = await response.text();

    const rating = html.match(/<div class="rating-number">(\d+)<\/div>/)?.[1] || 'N/A';

    const contestMatch = html.match(/No\. of Contests Participated:\s*<b>(\d+)<\/b>/);
    const contests = contestMatch?.[1] || 'N/A';

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json({ rating, contests });

  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch CodeChef data' });
  }
}
