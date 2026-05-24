import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { CheckCircle, ChevronLeft, Clock, Lightbulb } from 'lucide-react'
import { LESSONS } from '../data/lessonData'
import { useLessons } from '../hooks/useLessons'
import { useStreak } from '../hooks/useStreak'
import PageHeader from '../components/layout/PageHeader'
import MilestoneCelebration from '../components/celebration/MilestoneCelebration'
import { getMilestone, isMilestone } from '../data/milestones'
import { KEYS } from '../utils/storageKeys'

export default function LessonDetailPage() {
  const { day } = useParams()
  const navigate = useNavigate()
  const lesson = LESSONS.find(l => l.day === Number(day))
  const { isCompleted, isUnlocked, completeLesson } = useLessons()
  const { recordLessonComplete } = useStreak()

  const [quizStarted, setQuizStarted] = useState(false)
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [celebrating, setCelebrating] = useState(false)

  // Show milestone celebration when revisiting an already-completed milestone day
  useEffect(() => {
    if (!lesson) return
    if (!isMilestone(lesson.day)) return
    try {
      const seen = JSON.parse(localStorage.getItem(KEYS.MILESTONES_SEEN) || '[]')
      // If completed but never celebrated (e.g. completed before this feature existed), show it once
      if (isCompleted(lesson.day) && !seen.includes(lesson.day)) {
        setCelebrating(true)
      }
    } catch (e) { /* ignore */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson?.day])

  function markMilestoneSeen(day) {
    try {
      const seen = JSON.parse(localStorage.getItem(KEYS.MILESTONES_SEEN) || '[]')
      if (!seen.includes(day)) {
        seen.push(day)
        localStorage.setItem(KEYS.MILESTONES_SEEN, JSON.stringify(seen))
      }
    } catch (e) { /* ignore */ }
  }

  function handleCelebrationClose() {
    if (lesson) markMilestoneSeen(lesson.day)
    setCelebrating(false)
  }

  if (!lesson) return <div className="p-4 text-gray-500">Lesson not found.</div>
  if (!isUnlocked(lesson.day)) return (
    <div className="p-6 text-center">
      <div className="text-5xl mb-4">🔒</div>
      <p className="text-gray-600 font-medium">Complete Day {lesson.day - 1} to unlock this lesson.</p>
      <button onClick={() => navigate('/lessons')} className="mt-4 text-brand-primary text-sm font-medium">Back to Lessons</button>
    </div>
  )

  const completed = isCompleted(lesson.day)
  const score = submitted ? lesson.quiz.filter((q, i) => answers[i] === q.correctIndex).length : 0

  function handleSubmitQuiz() {
    setSubmitted(true)
    completeLesson(lesson.day, score, lesson.quiz.length)
    recordLessonComplete()
    if (isMilestone(lesson.day)) {
      // small delay so the user sees their score land first
      setTimeout(() => setCelebrating(true), 600)
    }
  }

  return (
    <div className="pb-8">
      {celebrating && (
        <MilestoneCelebration
          milestone={getMilestone(lesson.day)}
          day={lesson.day}
          onClose={handleCelebrationClose}
        />
      )}
      <PageHeader title={`Day ${lesson.day}`} subtitle={`${lesson.readTimeMin} min read`} backTo="/lessons" />

      {/* Lesson content */}
      <div className="p-4 space-y-4">
        {/* Opening Prayer */}
        {lesson.prayer && (
          <div className="bg-gradient-to-br from-[#4B2E83]/10 to-[#A88FCF]/10 border border-[#A88FCF]/30 rounded-2xl p-4">
            <p className="text-xs font-semibold text-brand-primary uppercase tracking-widest mb-2 font-brand">Opening Prayer</p>
            <p className="text-sm text-gray-700 italic leading-relaxed font-display">{lesson.prayer}</p>
          </div>
        )}

        {/* Scripture */}
        <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-2xl p-4">
          <p className="text-amber-800 italic text-sm leading-relaxed font-display">"{lesson.scripture.verse}"</p>
          <p className="text-amber-600 text-xs font-medium mt-1">— {lesson.scripture.reference}</p>
        </div>

        {/* Accent divider */}
        <div className="flex justify-center py-1">
          <img src="/accent.png" alt="" className="w-24 opacity-70" />
        </div>

        {/* Title */}
        <div>
          <h1 className="text-xl font-bold text-gray-900 font-brand">{lesson.title}</h1>
          <p className="text-gray-500 text-sm">{lesson.subtitle}</p>
        </div>

        {/* Content */}
        <div className="prose-sm text-gray-700 leading-relaxed space-y-4">
          {lesson.content.split('\n\n').map((para, i) => {
            if (para.startsWith('**') && para.endsWith('**')) {
              return <h3 key={i} className="font-semibold text-gray-900 text-base mt-2">{para.replace(/\*\*/g,'')}</h3>
            }
            // Bold inline text
            const parts = para.split(/\*\*(.*?)\*\*/g)
            return (
              <p key={i} className="text-sm leading-relaxed text-gray-700">
                {parts.map((p, j) => j % 2 === 1 ? <strong key={j}>{p}</strong> : p)}
              </p>
            )
          })}
        </div>

        {/* Daily Challenge */}
        <div className="bg-brand-pale border border-brand-secondary/30 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb size={16} className="text-brand-primary" />
            <span className="font-semibold text-brand-primary text-sm">Today's Challenge</span>
          </div>
          <p className="text-sm text-brand-primary leading-relaxed">{lesson.challenge}</p>
        </div>

        {/* Quiz */}
        {!completed && !quizStarted && (
          <button onClick={() => setQuizStarted(true)}
                  className="w-full bg-brand-primary text-white py-4 rounded-2xl font-semibold hover:bg-[#3a2270] transition-colors">
            Take the Quiz ({lesson.quiz.length} questions)
          </button>
        )}

        {(quizStarted || completed) && (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Knowledge Check</h3>
            {lesson.quiz.map((q, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-2xl p-4 space-y-3">
                <p className="text-sm font-medium text-gray-800">{i+1}. {q.question}</p>
                <div className="space-y-2">
                  {q.options.map((opt, j) => {
                    const selected = answers[i] === j
                    const isCorrect = j === q.correctIndex
                    const showResult = submitted || (completed)
                    return (
                      <button key={j}
                              onClick={() => !submitted && !completed && setAnswers(a => ({...a, [i]: j}))}
                              className={`w-full text-left p-3 rounded-xl text-sm border transition-colors ${
                                showResult
                                  ? isCorrect ? 'bg-green-50 border-green-400 text-green-800'
                                    : selected ? 'bg-red-50 border-red-300 text-red-700'
                                    : 'bg-gray-50 border-gray-200 text-gray-500'
                                  : selected ? 'bg-indigo-50 border-brand-secondary text-brand-primary'
                                  : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                              }`}>
                        {opt}
                      </button>
                    )
                  })}
                </div>
                {submitted && (
                  <p className="text-xs text-gray-500 italic bg-gray-50 rounded-lg p-2">{q.explanation}</p>
                )}
              </div>
            ))}

            {!submitted && !completed && (
              <button onClick={handleSubmitQuiz}
                      disabled={Object.keys(answers).length < lesson.quiz.length}
                      className="w-full bg-green-600 text-white py-4 rounded-2xl font-semibold disabled:opacity-40 hover:bg-green-700 transition-colors">
                Submit Answers
              </button>
            )}

            {(submitted) && (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-center">
                <CheckCircle size={32} className="text-green-500 mx-auto mb-2" />
                <p className="font-semibold text-green-800">Day {lesson.day} Complete!</p>
                {!completed && <p className="text-sm text-green-600">Score: {score}/{lesson.quiz.length} correct</p>}
                <button onClick={() => navigate('/lessons')}
                        className="mt-3 bg-green-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-green-700 transition-colors">
                  Back to Lessons
                </button>
              </div>
            )}

            {completed && !submitted && (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-center">
                <CheckCircle size={28} className="text-green-500 mx-auto mb-1" />
                <p className="font-medium text-green-800 text-sm">You completed this lesson</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
