import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Circle,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Trophy,
  AlertTriangle,
  ArrowRight,
  Printer
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ActionPlanStep } from '../types';

interface ActionPlanChecklistProps {
  steps: ActionPlanStep[];
  quickWins: string[];
  completedStepNumbers: number[];
  completedQuickWins: number[];
  onToggleStep: (stepNumber: number) => void;
  onToggleQuickWin: (idx: number) => void;
  onJumpToStorage: () => void;
}

export const ActionPlanChecklist: React.FC<ActionPlanChecklistProps> = ({
  steps,
  quickWins,
  completedStepNumbers,
  completedQuickWins,
  onToggleStep,
  onToggleQuickWin,
  onJumpToStorage,
}) => {
  // Timer state for micro-sprints
  const [timerSeconds, setTimerSeconds] = useState<number>(15 * 60); // 15 mins default
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [filterPriority, setFilterPriority] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch (e) {}
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const totalSteps = steps.length;
  const completedCount = completedStepNumbers.length;
  const percentComplete = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;

  const totalMinutes = steps.reduce((sum, s) => sum + s.durationMinutes, 0);
  const completedMinutes = steps
    .filter((s) => completedStepNumbers.includes(s.stepNumber))
    .reduce((sum, s) => sum + s.durationMinutes, 0);
  const remainingMinutes = Math.max(0, totalMinutes - completedMinutes);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStepClick = (stepNum: number) => {
    const wasAlreadyDone = completedStepNumbers.includes(stepNum);
    onToggleStep(stepNum);

    // If just finished the last step, trigger victory confetti!
    if (!wasAlreadyDone && completedCount + 1 === totalSteps) {
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.5 },
        });
      } catch (e) {}
    }
  };

  const filteredSteps = steps.filter((step) => {
    if (filterPriority === 'all') return true;
    return step.priority === filterPriority;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Header Card */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Sequential Decluttering Action Plan
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Execute in order to avoid shifting mess between areas. Check off steps as you complete them.
          </p>
        </div>

        {/* 15-Minute Sprint Timer Widget */}
        <div className="bg-slate-50 dark:bg-slate-800/80 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-3">
          <Clock className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-slate-400">
              Sprint Timer
            </span>
            <span className="font-mono text-base font-bold text-slate-900 dark:text-white tabular-nums">
              {formatTimer(timerSeconds)}
            </span>
          </div>
          <div className="flex items-center gap-1 ml-2">
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="p-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs transition-colors"
              title={isTimerRunning ? 'Pause timer' : 'Start 15-min sprint'}
            >
              {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => {
                setIsTimerRunning(false);
                setTimerSeconds(15 * 60);
              }}
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
              title="Reset timer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Progress & Metric Strip */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 dark:text-white">Overall Plan Progress</span>
            <span className="font-mono tabular-nums text-teal-600 dark:text-teal-400 font-bold">
              {percentComplete}%
            </span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-500 font-mono tabular-nums">
              {completedCount} of {totalSteps} steps completed
            </span>
          </div>
          <div className="text-slate-500 font-mono tabular-nums">
            <span className="text-slate-800 dark:text-slate-200 font-semibold">{remainingMinutes} mins</span> estimated remaining
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-teal-600 dark:bg-teal-500 transition-all duration-500 ease-out rounded-full"
            style={{ width: `${percentComplete}%` }}
          />
        </div>
      </div>

      {/* 5-Minute Quick Wins Checklist */}
      <div className="bg-teal-50/60 dark:bg-teal-950/20 p-5 rounded-xl border border-teal-200 dark:border-teal-900/40 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <h3 className="text-xs font-bold text-teal-950 dark:text-teal-200">
              Immediate 5-Minute Quick Wins
            </h3>
          </div>
          <span className="text-[11px] font-mono tabular-nums text-teal-700 dark:text-teal-400">
            {completedQuickWins.length}/{quickWins.length} done
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {quickWins.map((win, idx) => {
            const isDone = completedQuickWins.includes(idx);
            return (
              <div
                key={idx}
                onClick={() => onToggleQuickWin(idx)}
                className={`p-3 rounded-lg border transition-all cursor-pointer flex items-start gap-2.5 ${
                  isDone
                    ? 'bg-teal-100/40 dark:bg-teal-900/20 border-teal-300 dark:border-teal-800 opacity-70'
                    : 'bg-white dark:bg-slate-900 border-teal-200 dark:border-teal-900/40 hover:border-teal-400'
                }`}
              >
                <button type="button" className="mt-0.5 text-teal-600 dark:text-teal-400 shrink-0">
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 fill-teal-600 text-white" />
                  ) : (
                    <Circle className="w-4 h-4" />
                  )}
                </button>
                <span
                  className={`text-xs text-slate-800 dark:text-slate-200 ${
                    isDone ? 'line-through text-slate-400 dark:text-slate-500' : ''
                  }`}
                >
                  {win}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Priority Filters */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <button
            onClick={() => setFilterPriority('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              filterPriority === 'all'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            All Steps ({steps.length})
          </button>
          <button
            onClick={() => setFilterPriority('high')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              filterPriority === 'high'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            High Priority ({steps.filter((s) => s.priority === 'high').length})
          </button>
          <button
            onClick={() => setFilterPriority('medium')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              filterPriority === 'medium'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            Medium ({steps.filter((s) => s.priority === 'medium').length})
          </button>
        </div>

        <button
          onClick={() => window.print()}
          className="hidden sm:flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print Checklist</span>
        </button>
      </div>

      {/* Sequential Steps List */}
      <div className="space-y-3">
        {filteredSteps.map((step) => {
          const isDone = completedStepNumbers.includes(step.stepNumber);
          return (
            <div
              key={step.stepNumber}
              onClick={() => handleStepClick(step.stepNumber)}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                isDone
                  ? 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-60'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <button
                  type="button"
                  className="mt-0.5 text-teal-600 dark:text-teal-400 shrink-0"
                >
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 fill-teal-600 text-white" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-400">
                        Step {step.stepNumber.toString().padStart(2, '0')}
                      </span>
                      <span className="text-slate-300 dark:text-slate-700">·</span>
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        {step.zone}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      <span className="font-mono tabular-nums text-slate-600 dark:text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        ~{step.durationMinutes} mins
                      </span>
                      <span
                        className={`text-[10px] font-medium px-1.5 py-0.5 rounded capitalize ${
                          step.priority === 'high'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            : step.priority === 'medium'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        {step.priority}
                      </span>
                    </div>
                  </div>

                  <h4
                    className={`text-sm font-bold text-slate-900 dark:text-white ${
                      isDone ? 'line-through text-slate-400' : ''
                    }`}
                  >
                    {step.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    {step.details}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Completion Banner */}
      {percentComplete === 100 && (
        <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 p-6 rounded-xl text-center space-y-2">
          <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-sm">
            <Trophy className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-emerald-950 dark:text-emerald-100">
            Room Decluttering Completed!
          </h3>
          <p className="text-xs text-emerald-800 dark:text-emerald-300 max-w-md mx-auto">
            You successfully cleared the space, assigned designated homes to your items, and completed your roadmap. Check the Storage Solutions tab to keep it tidy long-term!
          </p>
        </div>
      )}

      {/* Link to Storage */}
      <div className="pt-2 flex justify-end">
        <button
          onClick={onJumpToStorage}
          className="px-5 py-2.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors flex items-center gap-2 shadow-sm"
        >
          <span>Explore Recommended Storage Solutions</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
