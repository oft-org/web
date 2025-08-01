const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function fetchSeasonMatches(seasonId) {
  const response = await fetch(`${API_BASE_URL}/match/season?season_id=${seasonId}`)
  
  if (!response.ok) {
    throw new Error(`Error fetching season matches: ${response.statusText}`)
  }
  
  const data = await response.json()
  return data
}

export async function fetchMatchDetails(matchId) {
  const response = await fetch(`${API_BASE_URL}/match/${matchId}`)
  
  if (!response.ok) {
    throw new Error(`Error fetching match details: ${response.statusText}`)
  }
  
  const data = await response.json()
  return data
}

export async function playMatch(seasonId, matchId) {
  const response = await fetch(`${API_BASE_URL}/match/play`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      season_id: seasonId,
      match_id: matchId
    })
  })
  
  if (!response.ok) {
    throw new Error(`Error playing match: ${response.statusText}`)
  }
  
  const data = await response.json()
  return data
}