'use server'

const API_KEY = process.env.BALL_DONT_LIE_API_KEY;

// 1. STATS FETCH (For the Side Panel)
export async function getPlayerStats(playerId: number) {
  // Return null if key is missing (prevents crash)
  if (!API_KEY) return null;

  try {
    const res = await fetch(`https://api.balldontlie.io/v1/season_averages?season=2024&player_ids[]=${playerId}`, {
      headers: { 'Authorization': API_KEY },
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!res.ok) throw new Error('Failed');
    const data = await res.json();
    return data.data[0] || null;
  } catch (error) {
    console.error('Stats Error:', error);
    return null;
  }
}

// 2. PLAYER SEARCH (For the Search Bar)
export async function searchPlayer(query: string) {
  if (!API_KEY) return [];

  try {
    const res = await fetch(`https://api.balldontlie.io/v1/players?search=${query}`, {
      headers: { 'Authorization': API_KEY },
      next: { revalidate: 3600 }
    });

    if (!res.ok) throw new Error('Failed');
    const data = await res.json();
    
    // Transform the API data to match what our App expects
    return data.data.map((p: any) => ({
      id: p.id,
      label: `${p.first_name} ${p.last_name}`,
      team: p.team?.abbreviation || 'FA',
      img: String(p.id) // Use ID for image lookup
    })).slice(0, 5); // Just take the top 5 results
  } catch (error) {
    console.error('Search Error:', error);
    return [];
  }
}