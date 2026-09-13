import React, { useState } from 'react';
import { Sparkles, Flame, CheckCircle2, ChevronRight, HelpCircle, Lightbulb, Play, ArrowRight, BookOpen, RefreshCw } from 'lucide-react';

const DAILY_QUESTIONS = [
  {
    id: 1,
    category: 'System Design',
    role: 'Software Engineer',
    difficulty: 'Medium',
    question: 'How would you design an idempotent payment processing API to prevent duplicate transactions if a network timeout occurs?',
    keyPoints: [
      'Generate a unique idempotency key on client before request',
      'Store key in Redis / database with atomic INSERT / SETNX',
      'If key already exists, return cached initial transaction response',
      'Use database distributed locks or transactions for balance deduction'
    ],
    framework: '1. Problem scope & failure modes (network drop, retry storm) -> 2. Client idempotency key strategy -> 3. Server-side deduplication table -> 4. State machine (PENDING, SUCCESS, FAILED).'
  },
  {
    id: 2,
    category: 'Behavioral',
    role: 'All Roles',
    difficulty: 'General',
    question: 'Tell me about a time you strongly disagreed with an engineering decision made by your team. How did you handle it and what was the outcome?',
    keyPoints: [
      'State the situation without blaming colleagues',
      'Explain your technical rationale with objective data / metrics',
      'Describe how you actively listened to their alternative trade-offs',
      'Demonstrate "disagree and commit" alignment once the final decision was made'
    ],
    framework: 'STAR Format: Situation (the architectural conflict) -> Task (what was needed) -> Action (how you presented trade-offs diplomatically) -> Result (successful delivery and team trust).'
  },
  {
    id: 3,
    category: 'Algorithms & CS',
    role: 'Software Engineer',
    difficulty: 'Hard',
    question: 'Explain the internal difference between a B-Tree and a Hash index in relational databases, and when one fails compared to the other.',
    keyPoints: [
      'Hash indexes offer O(1) equality lookups but cannot do range queries (e.g. BETWEEN, >, <)',
      'B-Trees keep data sorted, allowing O(log N) point queries and efficient range scans',
      'B-Tree nodes fit disk page sizes to minimize disk I/O reads',
      'Hash indexes suffer on high-collision hash distributions or prefix searching'
    ],
    framework: '1. High-level definition -> 2. Time complexity comparison -> 3. Range vs Point queries -> 4. Disk paging and memory architecture -> 5. Concrete PostgreSQL / MySQL example.'
  }
];

const DailyChallengeCard = ({ onStartPractice }) => {
  // Rotate question based on current day
  const dayIndex = new Date().getDate() % DAILY_QUESTIONS.length;
  const [questionIdx, setQuestionIdx] = useState(dayIndex);
  const [showAnswer, setShowAnswer] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [userNotes, setUserNotes] = useState('');

  const currentQ = DAILY_QUESTIONS[questionIdx];

  const handleNext = () => {
    setShowAnswer(false);
    setCompleted(false);
    setUserNotes('');
    setQuestionIdx((prev) => (prev + 1) % DAILY_QUESTIONS.length);
  };

  return (
    <div className="glass-card p-6 border border-cream-border/70 rounded-2xl bg-white/95 shadow-xs relative overflow-hidden flex flex-col justify-between">
      {/* Decorative gradient blur */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-primary/10 via-amber-500/5 to-transparent rounded-bl-full pointer-events-none" />

      <div>
        {/* Card Header with Streak & Badge */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-xs">
              <Flame size={16} className="fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-display font-bold text-sm text-midnight">Daily Rapid Drill</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                  Day 1 Streak 🔥
                </span>
              </div>
              <p className="text-[11px] text-gray-400">Sharpen your instincts with 1 question every 24h</p>
            </div>
          </div>

          <button
            onClick={handleNext}
            title="Next Question"
            className="p-1.5 rounded-lg text-gray-400 hover:text-midnight hover:bg-cream-darker/20 transition-colors"
          >
            <RefreshCw size={14} />
          </button>
        </div>

        {/* Category and Difficulty */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">
            {currentQ.category}
          </span>
          <span className="text-[10px] font-medium text-gray-400">
            {currentQ.role} • <span className={currentQ.difficulty === 'Hard' ? 'text-red-500' : 'text-emerald-600'}>{currentQ.difficulty}</span>
          </span>
        </div>

        {/* The Question */}
        <div className="p-3.5 rounded-xl bg-cream/40 border border-cream-border/80 mb-3.5">
          <p className="text-xs md:text-sm font-semibold text-midnight leading-relaxed">
            "{currentQ.question}"
          </p>
        </div>

        {/* Interactive Answer / Evaluation View */}
        {!showAnswer ? (
          <div className="mb-4">
            <textarea
              rows={2}
              value={userNotes}
              onChange={(e) => setUserNotes(e.target.value)}
              placeholder="Draft your bullet points or mental answer outline here..."
              className="w-full text-xs p-3 rounded-xl border border-cream-border/70 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
            />
          </div>
        ) : (
          <div className="mb-4 space-y-2.5 animate-fadeIn">
            {/* Talking points */}
            <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-200/60 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-purple-900 mb-1 text-[11px]">
                <Lightbulb size={13} className="text-purple-600" />
                <span>Key Concepts Evaluators Look For:</span>
              </div>
              <ul className="list-disc list-inside text-purple-950 space-y-1 text-[11px]">
                {currentQ.keyPoints.map((pt, i) => (
                  <li key={i} className="leading-snug">{pt}</li>
                ))}
              </ul>
            </div>

            {/* Framework */}
            <div className="p-2.5 rounded-xl bg-cream/50 border border-cream-border/60 text-[11px] text-gray-600">
              <span className="font-bold text-midnight block mb-0.5">Answer Structuring Framework:</span>
              <p className="leading-relaxed text-gray-500">{currentQ.framework}</p>
            </div>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-cream-border/60 flex flex-wrap items-center justify-between gap-2">
        <button
          onClick={() => {
            setShowAnswer(!showAnswer);
            if (!completed) setCompleted(true);
          }}
          className="text-xs font-bold text-primary hover:text-primary-dark flex items-center gap-1 hover:underline"
        >
          <BookOpen size={13} />
          <span>{showAnswer ? 'Hide Framework' : 'Reveal Ideal Answer Framework'}</span>
        </button>

        <button
          onClick={() => onStartPractice && onStartPractice(currentQ.category === 'Behavioral' ? 'Behavioral' : 'Technical')}
          className="btn-primary py-1.5 px-3 text-[11px] font-bold shadow-xs flex items-center gap-1.5"
        >
          <Play size={11} fill="white" />
          <span>Simulate Live</span>
        </button>
      </div>
    </div>
  );
};

export default DailyChallengeCard;
