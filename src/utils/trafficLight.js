export const LIGHT_CONFIG = {
  green: {
    label: 'Eat Freely',
    color: '#22c55e',
    bg: '#dcfce7',
    border: '#86efac',
    text: '#15803d',
    tailwind: 'bg-green-100 text-green-800 border-green-300',
    dot: 'bg-green-500',
    ring: 'ring-green-200',
  },
  yellow: {
    label: 'Moderate',
    color: '#eab308',
    bg: '#fef9c3',
    border: '#fde047',
    text: '#a16207',
    tailwind: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    dot: 'bg-yellow-500',
    ring: 'ring-yellow-200',
  },
  orange: {
    label: 'Small Portions',
    color: '#f97316',
    bg: '#ffedd5',
    border: '#fdba74',
    text: '#c2410c',
    tailwind: 'bg-orange-100 text-orange-800 border-orange-300',
    dot: 'bg-orange-500',
    ring: 'ring-orange-200',
  },
}

export function getLightForCal(caloriesPer100g) {
  if (caloriesPer100g <= 150) return 'green'
  if (caloriesPer100g <= 350) return 'yellow'
  return 'orange'
}

export function getLightConfig(light) {
  return LIGHT_CONFIG[light] || LIGHT_CONFIG.green
}
