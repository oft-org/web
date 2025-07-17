export async function fetchClassification(seasonId) {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/season/${seasonId}/classification`)
  if (!res.ok) throw new Error('API Error')
  return res.json()
}