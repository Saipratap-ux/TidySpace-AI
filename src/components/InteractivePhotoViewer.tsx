import React, { useState } from 'react';
import {
  Eye,
  EyeOff,
  Layers,
  Sparkles,
  Info,
  AlertCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { ClutterZone, RoomAnalysisResult } from '../types';

interface InteractivePhotoViewerProps {
  imageSrc: string;
  analysis: RoomAnalysisResult;
  selectedZoneId: string | null;
  onSelectZone: (zoneId: string | null) => void;
  onJumpToSorting: () => void;
  onJumpToChecklist: () => void;
}

export const InteractivePhotoViewer: React.FC<InteractivePhotoViewerProps> = ({
  imageSrc,
  analysis,
  selectedZoneId,
  onSelectZone,
  onJumpToSorting,
  onJumpToChecklist,
}) => {
  const [showOverlays, setShowOverlays] = useState<boolean>(true);
  const [hoveredZoneId, setHoveredZoneId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'photo' | 'blueprint'>('photo');

  const activeZone = analysis.zones.find(
    (z) => z.id === (hoveredZoneId || selectedZoneId)
  );

  return (
    <div className="space-y-6">
      {/* Top Metric Bar & View Toggle */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Metric summary */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-600 dark:text-slate-300">
          <div>
            <span className="text-slate-400 dark:text-slate-500 block text-[11px]">Room Type</span>
            <span className="font-semibold text-slate-900 dark:text-white text-sm">
              {analysis.roomTypeDetected}
            </span>
          </div>
          <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">|</span>
          <div>
            <span className="text-slate-400 dark:text-slate-500 block text-[11px]">Clutter Intensity</span>
            <span className="font-semibold font-mono tabular-nums text-slate-900 dark:text-white text-sm">
              {analysis.clutterScore} / 10
            </span>
          </div>
          <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">|</span>
          <div>
            <span className="text-slate-400 dark:text-slate-500 block text-[11px]">Estimated Effort</span>
            <span className="font-semibold font-mono tabular-nums text-slate-900 dark:text-white text-sm">
              ~{analysis.totalEstimatedMinutes} mins
            </span>
          </div>
          <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">|</span>
          <div>
            <span className="text-slate-400 dark:text-slate-500 block text-[11px]">Zones Detected</span>
            <span className="font-semibold font-mono tabular-nums text-teal-600 dark:text-teal-400 text-sm">
              {analysis.zones.length} Hotspots
            </span>
          </div>
        </div>

        {/* View toggles */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <button
              onClick={() => setViewMode('photo')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                viewMode === 'photo'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              Inspected Photo
            </button>
            <button
              onClick={() => setViewMode('blueprint')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                viewMode === 'blueprint'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              Clear Vision
            </button>
          </div>

          {viewMode === 'photo' && (
            <button
              onClick={() => setShowOverlays(!showOverlays)}
              title={showOverlays ? 'Hide visual zone overlays' : 'Show visual zone overlays'}
              className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700"
            >
              {showOverlays ? <Eye className="w-4 h-4 text-teal-600 dark:text-teal-400" /> : <EyeOff className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Main Visual Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Photo Canvas with Overlays */}
        <div className="lg:col-span-8 space-y-4">
          <div className="relative w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 shadow-md">
            {viewMode === 'photo' ? (
              <div className="relative aspect-[4/3] w-full flex items-center justify-center">
                <img
                  src={imageSrc}
                  alt="Room Analysis"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />

                {/* Overlaid Hotspot Bounding Boxes */}
                {showOverlays &&
                  analysis.zones.map((zone, idx) => {
                    const isSelected = selectedZoneId === zone.id;
                    const isHovered = hoveredZoneId === zone.id;
                    const isActive = isSelected || isHovered;

                    // Convert 0-1000 scale to percentages
                    const top = zone.box.ymin / 10;
                    const left = zone.box.xmin / 10;
                    const height = Math.max(8, (zone.box.ymax - zone.box.ymin) / 10);
                    const width = Math.max(8, (zone.box.xmax - zone.box.xmin) / 10);

                    const severityColor =
                      zone.severity === 'high'
                        ? 'border-rose-500 bg-rose-500/15 text-rose-500'
                        : zone.severity === 'medium'
                        ? 'border-amber-500 bg-amber-500/15 text-amber-500'
                        : 'border-teal-500 bg-teal-500/15 text-teal-500';

                    const badgeColor =
                      zone.severity === 'high'
                        ? 'bg-rose-600 text-white'
                        : zone.severity === 'medium'
                        ? 'bg-amber-600 text-white'
                        : 'bg-teal-600 text-white';

                    return (
                      <div
                        key={zone.id || idx}
                        style={{
                          top: `${top}%`,
                          left: `${left}%`,
                          height: `${height}%`,
                          width: `${width}%`,
                        }}
                        onMouseEnter={() => setHoveredZoneId(zone.id)}
                        onMouseLeave={() => setHoveredZoneId(null)}
                        onClick={() => onSelectZone(isSelected ? null : zone.id)}
                        className={`absolute border-2 transition-all cursor-pointer rounded-md ${severityColor} ${
                          isActive
                            ? 'ring-4 ring-white/50 scale-[1.01] z-20 shadow-lg'
                            : 'opacity-85 hover:opacity-100 z-10'
                        }`}
                      >
                        {/* Zone marker index tag */}
                        <div
                          className={`absolute -top-3 -left-1 px-1.5 py-0.5 rounded text-[10px] font-bold tracking-tight shadow-sm ${badgeColor}`}
                        >
                          {idx + 1}
                        </div>
                      </div>
                    );
                  })}
              </div>
            ) : (
              /* Transformation Blueprint View */
              <div className="relative aspect-[4/3] w-full p-6 sm:p-8 bg-slate-900 text-slate-100 flex flex-col justify-between overflow-y-auto">
                <div>
                  <div className="flex items-center gap-2 text-teal-400 text-xs font-semibold mb-2">
                    <Sparkles className="w-4 h-4" />
                    <span>Transformed State Blueprint</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
                    Your Future Organized {analysis.roomTypeDetected}
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
                    {analysis.transformationVision}
                  </p>
                </div>

                {/* Spatial Zones Mapping */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
                  <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700">
                    <div className="text-xs font-bold text-emerald-400 mb-1">1. Active Focus Zone</div>
                    <p className="text-[11px] text-slate-300">
                      Primary horizontal work/living plane cleared of daily backlog. Only immediate essentials stay within arm's reach.
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700">
                    <div className="text-xs font-bold text-teal-400 mb-1">2. Access Storage Zone</div>
                    <p className="text-[11px] text-slate-300">
                      Categorized bins, drawer dividers, and concealed wire routing providing dedicated homes for accessories.
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700">
                    <div className="text-xs font-bold text-sky-400 mb-1">3. Negative Space</div>
                    <p className="text-[11px] text-slate-300">
                      Deliberately uncrowded floor perimeter and corners that restore calm, natural room lighting, and easy cleaning.
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>Switch back to "Inspected Photo" above to review detected hotspot overlays.</span>
                  <button
                    onClick={onJumpToChecklist}
                    className="text-teal-400 hover:text-teal-300 font-semibold flex items-center gap-1"
                  >
                    <span>Start Action Plan</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Wins Strip */}
          <div className="bg-teal-50/70 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-900/50 p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-2 text-teal-800 dark:text-teal-300 font-bold text-xs">
              <Clock className="w-3.5 h-3.5" />
              <span>5-Minute Quick Momentum Wins (Do these first!)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 dark:text-slate-300">
              {analysis.quickWins.map((win, i) => (
                <div key={i} className="flex items-start gap-2 bg-white/70 dark:bg-slate-900/60 p-2.5 rounded-lg border border-teal-100 dark:border-teal-900/30">
                  <span className="font-mono text-teal-600 dark:text-teal-400 font-bold text-xs shrink-0">
                    0{i + 1}.
                  </span>
                  <span>{win}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Zone Hotspot Details */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Detected Clutter Hotspots
              </h3>
              <span className="text-xs text-slate-500">
                Click box to inspect
              </span>
            </div>

            <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
              {analysis.zones.map((zone, idx) => {
                const isSelected = selectedZoneId === zone.id;
                const isHovered = hoveredZoneId === zone.id;
                const isActive = isSelected || isHovered;

                return (
                  <div
                    key={zone.id || idx}
                    onMouseEnter={() => setHoveredZoneId(zone.id)}
                    onMouseLeave={() => setHoveredZoneId(null)}
                    onClick={() => onSelectZone(isSelected ? null : zone.id)}
                    className={`p-3 rounded-lg border transition-all cursor-pointer text-left ${
                      isActive
                        ? 'border-teal-600 bg-teal-50/50 dark:bg-teal-950/20 dark:border-teal-400'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono text-[11px] font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[170px]">
                          {zone.name}
                        </h4>
                      </div>
                      <span
                        className={`text-[10px] font-medium px-1.5 py-0.5 rounded capitalize ${
                          zone.severity === 'high'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            : zone.severity === 'medium'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        {zone.severity} priority
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 mt-1">
                      {zone.currentProblem}
                    </p>

                    {isActive && (
                      <div className="mt-2.5 pt-2.5 border-t border-slate-200 dark:border-slate-800 space-y-1.5 text-[11px]">
                        <div>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">Recommended Action: </span>
                          <span className="text-slate-600 dark:text-slate-400">{zone.recommendedAction}</span>
                        </div>
                        <div>
                          <span className="font-semibold text-teal-700 dark:text-teal-300">System to Put in Place: </span>
                          <span className="text-slate-600 dark:text-slate-400">{zone.proposedSolution}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Quick action buttons */}
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
              <button
                onClick={onJumpToSorting}
                className="w-full py-2 px-3 text-xs font-semibold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <span>View 3-Pile Sorting (Keep/Donate/Trash)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onJumpToChecklist}
                className="w-full py-2 px-3 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Follow Step-by-Step Action Plan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
