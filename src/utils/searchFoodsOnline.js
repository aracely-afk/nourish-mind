// Simple in-memory cache — avoids re-fetching the same query within a session
const cache = new Map()

/**
 * Search Open Food Facts text-search API.
 * Returns food objects shaped to match the app's food database entries.
 *
 * @param {string} query
 * @param {AbortSignal} [signal]
 * @returns {Promise<Array>}
 */
export async function searchFoodsOnline(query, signal) {
  const trimmed = query?.trim() ?? ''
  if (trimmed.length < 2) return []

  const key = trimmed.toLowerCase()
  if (cache.has(key)) return cache.get(key)

  try {
    const params = new URLSearchParams({
      search_terms: trimmed,
      search_simple: '1',
      action:        'process',
      json:          '1',
      page_size:     '30',
      fields:        'id,_id,product_name,product_name_en,brands,serving_size,serving_quantity,nutriments',
    })

    const res = await fetch(
      `https://world.openfoodfacts.org/cgi/search.pl?${params}`,
      { signal: signal ?? AbortSignal.timeout(8000) }
    )
    if (!res.ok) return []

    const data = await res.json()
    if (!Array.isArray(data.products)) return []

    const results = []
    for (const p of data.products) {
      const n = p.nutriments || {}
      const cal100g =
        n['energy-kcal_100g'] ??
        (n['energy-kj_100g'] ? Math.round(n['energy-kj_100g'] / 4.184) : null)

      if (!cal100g || cal100g <= 0) continue

      const productName = p.product_name || p.product_name_en
      if (!productName?.trim()) continue

      const brandName   = p.brands ? p.brands.split(',')[0].trim() : null
      const displayName = brandName ? `${productName} (${brandName})` : productName
      const servingSizeG = parseFloat(p.serving_quantity) || 100
      const servingLabel = p.serving_size?.trim() || `${servingSizeG}g`
      const trafficLight = cal100g < 300 ? 'green' : cal100g < 500 ? 'yellow' : 'orange'

      results.push({
        id:              `off_${p.id || p._id || productName.slice(0, 10)}_${results.length}`,
        name:            displayName.trim(),
        brand:           brandName,
        caloriesPer100g: Math.round(cal100g),
        servingSizeG,
        servingLabel,
        proteinG:        n.proteins_100g      ?? null,
        carbsG:          n.carbohydrates_100g ?? null,
        fatG:            n.fat_100g           ?? null,
        trafficLight,
        isOnline:        true,
        category:        'online',
      })
    }

    cache.set(key, results)
    return results
  } catch {
    return []
  }
}
