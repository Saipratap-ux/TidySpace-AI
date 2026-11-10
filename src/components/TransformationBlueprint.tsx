import React, { useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  Compass,
  Repeat,
  Printer,
  Share2,
  FileText,
  Lightbulb,
  ArrowRight
} from 'lucide-react';
import { RoomAnalysisResult } from '../types';

interface TransformationBlueprintProps {
  analysis: RoomAnalysisResult;
  roomType: string;
  imageSrc: string;
}

export const TransformationBlueprint: React.FC<TransformationBlueprintProps> = ({
  analysis,
  roomType,
  imageSrc,
}) => {
  const [deepBlueprint, setDeepBlueprint] = useState<string | null>(null);
  const [isGeneratingDeep, setIsGeneratingDeep] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const fetchDeepBlueprint = async () => {
    setIsGeneratingDeep(true);
    try {
      const res = await fetch('/api/generate-clean-layout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomType: analysis.roomTypeDetected,
          zones: analysis.zones,
          storageRecommendations: analysis.storageRecommendations,
        }),
      });
      const data = await res.json();
      if (data.blueprint) {
        setDeepBlueprint(data.blueprint);
      }
    } catch (e) {
      console.error('Failed to generate deep blueprint', e);
    } finally {
      setIsGeneratingDeep(false);
    }
  };

  const handleCopySummary = () => {
    const text = `TIDYSPACE DECLUTTERING BLUEPRINT
Room: ${analysis.roomTypeDetected}
Clutter Score: ${analysis.clutterScore}/10
Estimated Time: ${analysis.totalEstimatedMinutes} mins

VISION:
${analysis.transformationVision}

QUICK WINS:
${analysis.quickWins.map((w, i) => `${i + 1}. ${w}`).join('\n')}

SUSTAINABLE HABITS:
${analysis.sustainableHabits.map((h, i) => `• ${h}`).join('\n')}
`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Spatial Transformation Blueprint
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Architectural principles, daily maintenance rules, and long-term habits for a clutter-free environment.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopySummary}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
          </button>
          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Blueprint</span>
          </button>
        </div>
      </div>

      {/* Vision Statement Hero Card */}
      <div className="bg-gradient-to-br from-teal-900 via-slate-900 to-slate-950 text-white p-6 sm:p-8 rounded-2xl shadow-md space-y-4">
        <div className="flex items-center gap-2 text-teal-400 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>The Target State</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
          How this {analysis.roomTypeDetected} will feel once organized
        </h3>
        <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-3xl">
          "{analysis.transformationVision}"
        </p>

        <div className="pt-4 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono tabular-nums">
          <div>
            <span className="text-slate-400 block text-[11px]">Time Investment</span>
            <span className="font-bold text-white text-base">~{analysis.totalEstimatedMinutes} mins</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Clutter Reduction</span>
            <span className="font-bold text-emerald-400 text-base">-{analysis.clutterScore * 9}% mess</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Storage Systems</span>
            <span className="font-bold text-teal-300 text-base">{analysis.storageRecommendations.length} tailored</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Focus & Clarity</span>
            <span className="font-bold text-white text-base">Instant relief</span>
          </div>
        </div>
      </div>

      {/* 3 Foundational Spatial Rules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold text-xs mb-3">
            01
          </div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            The One-Touch Rule
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Never set an item down temporarily with the intent to put it away later. Either file it, stow it in its labeled home, or recycle it immediately.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold text-xs mb-3">
            02
          </div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            Horizontal Surface Quarantine
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Desk tops, dining tables, and bedside counters naturally attract clutter magnetic piles. Keep 75% of horizontal surface area completely bare at all times.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold text-xs mb-3">
            03
          </div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            The Container Limit
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Your storage space is a finite boundary, not a suggestion. When a designated bin or shelf is full, an existing item must be donated before a new one enters.
          </p>
        </div>
      </div>

      {/* Sustainable Daily Habits */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Repeat className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Daily 2-Minute Maintenance Habits
          </h3>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Clutter is a lagging indicator of unfinished routines. Practice these micro-habits every evening:
        </p>

        <div className="space-y-2.5">
          {analysis.sustainableHabits.map((habit, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200"
            >
              <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{habit}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Deep Layout Generation (Interactive AI tool) */}
      <div className="bg-slate-50 dark:bg-slate-900/40 p-6 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Compass className="w-4 h-4 text-teal-600" />
              <span>Generate Architectural Layout Blueprint</span>
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Get an in-depth spatial zoning spec and lighting / furniture placement guidelines.
            </p>
          </div>
          <button
            onClick={fetchDeepBlueprint}
            disabled={isGeneratingDeep}
            className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap self-start sm:self-auto"
          >
            {isGeneratingDeep ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Generating Blueprint...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>{deepBlueprint ? 'Regenerate Blueprint' : 'Generate Blueprint'}</span>
              </>
            )}
          </button>
        </div>

        {deepBlueprint && (
          <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed font-sans">
            {deepBlueprint}
          </div>
        )}
      </div>
    </div>
  );
};
