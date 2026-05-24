// Milestone celebration config — keyed by lesson day
export const MILESTONES = {
  21: {
    emoji: '🌱',
    title: 'Three Weeks Strong',
    headline: 'You\'ve planted something real.',
    message: 'Research shows it takes about 21 days for a behavior to start feeling familiar. You just crossed that threshold. The work is becoming yours.',
    scripture: '"He who began a good work in you will carry it on to completion." — Phil 1:6',
    gradient: 'from-emerald-500 via-teal-500 to-green-600',
    badge: 'Habit Builder',
  },
  31: {
    emoji: '🎉',
    title: 'One Month In',
    headline: 'A full month of showing up.',
    message: 'Thirty-one days ago you began. You\'ve learned more about yourself in this month than most people do in a year of trying. Pause and let that land.',
    scripture: '"His mercies are new every morning." — Lam 3:23',
    gradient: 'from-purple-500 via-pink-500 to-rose-500',
    badge: 'Month One Hero',
  },
  45: {
    emoji: '⭐',
    title: 'Halfway Home',
    headline: 'You are exactly halfway.',
    message: 'The first half was about awareness and unlearning. The second half is about integration and becoming. You are stronger than the version who started this.',
    scripture: '"They will run and not grow weary, they will walk and not be faint." — Is 40:31',
    gradient: 'from-amber-400 via-orange-500 to-pink-500',
    badge: 'Halfway Champion',
  },
  60: {
    emoji: '🔥',
    title: 'Two Months In',
    headline: 'Sixty days of becoming.',
    message: 'Two-thirds of the way. Your relationship with food is genuinely different now. The voice that talks about food in your head sounds different than it did on Day 1. That is transformation.',
    scripture: '"Being transformed into his image with ever-increasing glory." — 2 Cor 3:18',
    gradient: 'from-blue-500 via-indigo-500 to-purple-600',
    badge: 'Transformer',
  },
  75: {
    emoji: '👑',
    title: 'Three-Quarters Crowned',
    headline: 'You stayed in the arena.',
    message: 'Seventy-five days. Through hard weeks and slips and recommitments. This is the part most people don\'t reach. You\'re here.',
    scripture: '"I have fought the good fight, I have kept the faith." — 2 Tim 4:7',
    gradient: 'from-yellow-400 via-amber-500 to-orange-600',
    badge: 'Faithful Finisher',
  },
  90: {
    emoji: '🏆',
    title: 'Graduation Day',
    headline: 'You did it. You actually did it.',
    message: 'Ninety days. You showed up — for yourself, for your body, for the person you\'re becoming. This isn\'t the end. It\'s the start of the rest of your free life.',
    scripture: '"If the Son sets you free, you will be free indeed." — John 8:36',
    gradient: 'from-[#D4AF37] via-amber-500 to-yellow-600',
    badge: 'Food Freedom Graduate',
  },
}

export function isMilestone(day) {
  return Boolean(MILESTONES[day])
}

export function getMilestone(day) {
  return MILESTONES[day] || null
}
