import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, CheckCircle, ChevronRight } from 'lucide-react'
import { useLessons } from '../hooks/useLessons'
import { LESSONS } from '../data/lessonData'
import ProgressBar from '../components/ui/ProgressBar'
import { isMilestone, getMilestone } from '../data/milestones'

const THEME_COLORS = {
  awareness: 'bg-blue-100 text-blue-700',
  triggers:  'bg-red-100 text-red-700',
  theology:  'bg-purple-100 text-purple-700',
  habits:    'bg-green-100 text-green-700',
  identity:  'bg-indigo-100 text-indigo-700',
  review:    'bg-amber-100 text-amber-700',
}

export default function LessonsPage() {
  const { progress, isCompleted, isUnlocked, isWaitingForTomorrow } = useLessons()
  const navigate = useNavigate()
  const done = progress.completedLessons.length

  return (
    <div className="pb-4">
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-gray-100 px-4 py-3">
        <h1 className="font-semibold text-gray-900 font-brand">90 Days to Food Freedom</h1>
        <div className="flex items-center gap-2 mt-2">
          <ProgressBar value={done} max={90} color="bg-brand-primary" className="flex-1" />
          <span className="text-xs text-gray-500 flex-shrink-0">{done}/90</span>
        </div>
      </div>

      <div className="p-4 space-y-2">
        {LESSONS.map(lesson => {
          const completed = isCompleted(lesson.day)
          const unlocked = isUnlocked(lesson.day)
          const milestone = isMilestone(lesson.day) ? getMilestone(lesson.day) : null
          return (
            <button
              key={lesson.id}
              onClick={() => navigate(`/lessons/${lesson.day}`)}
              className={`w-full flex items-center gap-3 p-4 rounded-2xl border text-left transition-all relative ${
                milestone && unlocked && !completed ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-300 shadow-sm' :
                completed ? 'bg-green-50 border-green-200' :
                unlocked ? 'bg-white border-gray-200 hover:border-brand-secondary hover:shadow-sm' :
                'bg-gray-50 border-gray-200 hover:border-gray-300 hover:shadow-sm'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-sm ${
                completed ? 'bg-green-500 text-white' :
                milestone && unlocked ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white' :
                unlocked ? 'bg-brand-pale text-brand-primary' :
                'bg-gray-100 text-gray-500'
              }`}>
                {completed ? <CheckCircle size={20} /> :
                 unlocked ? lesson.day :
                 <Eye size={16} />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                  {milestone && (
                    <span className="text-xs font-bold px-1.5 py-0.5 rounded-full bg-amber-500 text-white">
                      {milestone.emoji} MILESTONE
                    </span>
                  )}
                  <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${THEME_COLORS[lesson.theme] || 'bg-gray-100 text-gray-600'}`}>
                    {lesson.theme}
                  </span>
                  {!unlocked && (
                    <span className="text-xs font-medium px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500">Preview</span>
                  )}
                  <span className="text-xs text-gray-500">{lesson.readTimeMin} min</span>
                </div>
                <p className={`text-sm font-medium leading-tight ${unlocked ? 'text-gray-800' : 'text-gray-600'}`}>{lesson.title}</p>
                {completed && progress.quizScores[lesson.day] && (
                  <p className="text-xs text-green-600 mt-0.5">
                    Quiz: {progress.quizScores[lesson.day].score}/{progress.quizScores[lesson.day].total} correct
                  </p>
                )}
              </div>
              {unlocked && !completed && <ChevronRight size={18} className="text-gray-400 flex-shrink-0" />}
              {!unlocked && <ChevronRight size={18} className="text-gray-300 flex-shrink-0" />}
              {completed && <CheckCircle size={18} className="text-green-500 flex-shrink-0" />}
            </button>
          )
        })}
      </div>
    </div>
  )
}
