import React, { useState } from 'react';
import {
  Package,
  DollarSign,
  Tag,
  MapPin,
  Sparkles,
  Search,
  ExternalLink,
  SlidersHorizontal
} from 'lucide-react';
import { StorageRecommendation } from '../types';

interface StorageGuideProps {
  recommendations: StorageRecommendation[];
  roomType: string;
}

export const StorageGuide: React.FC<StorageGuideProps> = ({
  recommendations,
  roomType,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['all', ...Array.from(new Set(recommendations.map((r) => r.category)))];

  const filtered = recommendations.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.diyOrBudgetAlternative.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Tailored Storage & Containment Solutions
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Systems designed to keep items in their place permanently, including zero-cost DIY alternatives.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search storage items or DIY tips..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* Category Filter Pills (Button tabs) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-teal-600 text-white border-teal-600 dark:bg-teal-500 dark:border-teal-500 font-semibold'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
            }`}
          >
            {cat === 'all' ? 'All Solutions' : cat}
          </button>
        ))}
      </div>

      {/* Grid of Storage Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-sm flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-teal-600 dark:text-teal-400">
                  {item.category}
                </span>
                <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300 tabular-nums">
                  {item.estimatedCost}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                {item.title}
              </h3>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {item.description}
              </p>

              {/* Placement */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-start gap-2 text-xs">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Where to place: </span>
                  <span className="text-slate-600 dark:text-slate-400">{item.recommendedPlacement}</span>
                </div>
              </div>
            </div>

            {/* DIY & Budget Alternative Card */}
            <div className="bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 p-3 rounded-lg text-xs space-y-1">
              <div className="flex items-center gap-1.5 text-amber-900 dark:text-amber-200 font-bold text-[11px]">
                <Sparkles className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                <span>Zero-Cost / DIY Alternative</span>
              </div>
              <p className="text-[11px] text-amber-950/80 dark:text-amber-300/80 leading-relaxed">
                {item.diyOrBudgetAlternative}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
