import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Heart,
  Gift,
  Trash2,
  Search,
  Plus,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { ThreePileSorting, KeepItem, DonateItem, DiscardItem } from '../types';

interface ThreePileSortingViewProps {
  sorting: ThreePileSorting;
  checklistItemsCompleted: Record<string, boolean>;
  onToggleCheckItem: (key: string) => void;
  onJumpToChecklist: () => void;
}

export const ThreePileSortingView: React.FC<ThreePileSortingViewProps> = ({
  sorting,
  checklistItemsCompleted,
  onToggleCheckItem,
  onJumpToChecklist,
}) => {
  const [activePile, setActivePile] = useState<'all' | 'keep' | 'donate' | 'discard'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [customItems, setCustomItems] = useState<{
    keep: KeepItem[];
    donate: DonateItem[];
    discardOrRecycle: DiscardItem[];
  }>({
    keep: [],
    donate: [],
    discardOrRecycle: [],
  });

  const [newItemPile, setNewItemPile] = useState<'keep' | 'donate' | 'discard'>('keep');
  const [newItemName, setNewItemName] = useState<string>('');
  const [newItemDetail, setNewItemDetail] = useState<string>('');
  const [showAddForm, setShowAddForm] = useState<boolean>(false);

  // Combine AI generated items with user-added custom items
  const allKeepItems = [...sorting.keep, ...customItems.keep];
  const allDonateItems = [...sorting.donate, ...customItems.donate];
  const allDiscardItems = [...sorting.discardOrRecycle, ...customItems.discardOrRecycle];

  const totalItemsCount = allKeepItems.length + allDonateItems.length + allDiscardItems.length;

  const countCompletedInPile = (items: { item: string }[], prefix: string) => {
    return items.filter((item, idx) => checklistItemsCompleted[`${prefix}_${idx}_${item.item}`]).length;
  };

  const keepCompleted = countCompletedInPile(allKeepItems, 'keep');
  const donateCompleted = countCompletedInPile(allDonateItems, 'donate');
  const discardCompleted = countCompletedInPile(allDiscardItems, 'discard');
  const totalCompleted = keepCompleted + donateCompleted + discardCompleted;

  const handleAddCustomItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    if (newItemPile === 'keep') {
      setCustomItems({
        ...customItems,
        keep: [
          ...customItems.keep,
          {
            item: newItemName.trim(),
            whereToPut: newItemDetail.trim() || 'Assigned organizer bin or shelf',
            rationale: 'User flagged essential item',
          },
        ],
      });
    } else if (newItemPile === 'donate') {
      setCustomItems({
        ...customItems,
        donate: [
          ...customItems.donate,
          {
            item: newItemName.trim(),
            recipientSuggestion: newItemDetail.trim() || 'Local charity or community drop box',
            rationale: 'Good condition, no longer needed',
          },
        ],
      });
    } else {
      setCustomItems({
        ...customItems,
        discardOrRecycle: [
          ...customItems.discardOrRecycle,
          {
            item: newItemName.trim(),
            ecoDisposalTip: newItemDetail.trim() || 'Check local municipal recycling guidelines',
            rationale: 'End-of-life or non-functional item',
          },
        ],
      });
    }

    setNewItemName('');
    setNewItemDetail('');
    setShowAddForm(false);
  };

  const filterMatches = (text: string) => {
    if (!searchQuery.trim()) return true;
    return text.toLowerCase().includes(searchQuery.toLowerCase());
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header bar */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            3-Pile Sorting Station
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Professional organizer method: Separate items into 3 clear boxes to remove decision fatigue.
          </p>
        </div>

        {/* Progress & stats */}
        <div className="flex items-center gap-4 text-xs font-mono tabular-nums">
          <div className="bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
            <span className="text-slate-400 block text-[10px]">Progress</span>
            <span className="font-bold text-slate-900 dark:text-white">
              {totalCompleted} / {totalItemsCount} sorted
            </span>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Item</span>
          </button>
        </div>
      </div>

      {/* Add Custom Item Modal / Drawer */}
      {showAddForm && (
        <form
          onSubmit={handleAddCustomItem}
          className="bg-slate-50 dark:bg-slate-900/70 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              Add Item to a Sorting Pile
            </span>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-xs text-slate-500 hover:text-slate-700"
            >
              Cancel
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Target Pile
              </label>
              <select
                value={newItemPile}
                onChange={(e) => setNewItemPile(e.target.value as any)}
                className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="keep">Keep (Assigned Home)</option>
                <option value="donate">Donate (Charity / Give away)</option>
                <option value="discard">Discard / Recycle</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Item Name
              </label>
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="e.g. Broken charger, Old magazines..."
                className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Placement / Recycling Tip
              </label>
              <input
                type="text"
                value={newItemDetail}
                onChange={(e) => setNewItemDetail(e.target.value)}
                placeholder="e.g. Put in cable tray or recycle at Best Buy"
                className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>
          <div className="flex justify-end pt-1">
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors"
            >
              Add to Pile
            </button>
          </div>
        </form>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Segmented controls (interactive buttons conforming to zero-pill rules) */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-lg w-full sm:w-auto">
          <button
            onClick={() => setActivePile('all')}
            className={`flex-1 sm:flex-none px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activePile === 'all'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            All Piles ({totalItemsCount})
          </button>
          <button
            onClick={() => setActivePile('keep')}
            className={`flex-1 sm:flex-none px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activePile === 'keep'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            Keep ({allKeepItems.length})
          </button>
          <button
            onClick={() => setActivePile('donate')}
            className={`flex-1 sm:flex-none px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activePile === 'donate'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            Donate ({allDonateItems.length})
          </button>
          <button
            onClick={() => setActivePile('discard')}
            className={`flex-1 sm:flex-none px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activePile === 'discard'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            Discard ({allDiscardItems.length})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* 3 Columns / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1. KEEP PILE */}
        {(activePile === 'all' || activePile === 'keep') && (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-emerald-200 dark:border-emerald-900/40 p-5 space-y-4 shadow-sm flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-100 dark:border-emerald-900/30">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Heart className="w-4 h-4 fill-emerald-600/20" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Pile 1: Keep
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Essential items getting designated spots
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono tabular-nums text-emerald-700 dark:text-emerald-400 font-semibold">
                {keepCompleted}/{allKeepItems.length}
              </span>
            </div>

            <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[500px] pr-1">
              {allKeepItems
                .filter((item) => filterMatches(item.item) || filterMatches(item.whereToPut))
                .map((item, idx) => {
                  const key = `keep_${idx}_${item.item}`;
                  const isChecked = !!checklistItemsCompleted[key];
                  return (
                    <div
                      key={key}
                      onClick={() => onToggleCheckItem(key)}
                      className={`p-3 rounded-lg border transition-all cursor-pointer text-left ${
                        isChecked
                          ? 'bg-emerald-50/50 dark:bg-emerald-950/15 border-emerald-200 dark:border-emerald-900/40 opacity-70'
                          : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 hover:border-emerald-300'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <button
                          type="button"
                          className="mt-0.5 text-emerald-600 dark:text-emerald-400 shrink-0"
                        >
                          {isChecked ? (
                            <CheckCircle2 className="w-4 h-4 fill-emerald-600 text-white" />
                          ) : (
                            <Circle className="w-4 h-4" />
                          )}
                        </button>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-xs font-bold text-slate-900 dark:text-white ${
                              isChecked ? 'line-through text-slate-500' : ''
                            }`}
                          >
                            {item.item}
                          </p>
                          <p className="text-[11px] text-emerald-700 dark:text-emerald-300 font-medium mt-0.5">
                            Assign to: {item.whereToPut}
                          </p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                            {item.rationale}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* 2. DONATE PILE */}
        {(activePile === 'all' || activePile === 'donate') && (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-indigo-200 dark:border-indigo-900/40 p-5 space-y-4 shadow-sm flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-indigo-100 dark:border-indigo-900/30">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Gift className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Pile 2: Donate
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Good condition items to pass forward
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono tabular-nums text-indigo-700 dark:text-indigo-400 font-semibold">
                {donateCompleted}/{allDonateItems.length}
              </span>
            </div>

            <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[500px] pr-1">
              {allDonateItems
                .filter((item) => filterMatches(item.item) || filterMatches(item.recipientSuggestion))
                .map((item, idx) => {
                  const key = `donate_${idx}_${item.item}`;
                  const isChecked = !!checklistItemsCompleted[key];
                  return (
                    <div
                      key={key}
                      onClick={() => onToggleCheckItem(key)}
                      className={`p-3 rounded-lg border transition-all cursor-pointer text-left ${
                        isChecked
                          ? 'bg-indigo-50/50 dark:bg-indigo-950/15 border-indigo-200 dark:border-indigo-900/40 opacity-70'
                          : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 hover:border-indigo-300'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <button
                          type="button"
                          className="mt-0.5 text-indigo-600 dark:text-indigo-400 shrink-0"
                        >
                          {isChecked ? (
                            <CheckCircle2 className="w-4 h-4 fill-indigo-600 text-white" />
                          ) : (
                            <Circle className="w-4 h-4" />
                          )}
                        </button>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-xs font-bold text-slate-900 dark:text-white ${
                              isChecked ? 'line-through text-slate-500' : ''
                            }`}
                          >
                            {item.item}
                          </p>
                          <p className="text-[11px] text-indigo-700 dark:text-indigo-300 font-medium mt-0.5">
                            Donate to: {item.recipientSuggestion}
                          </p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                            {item.rationale}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* 3. DISCARD / RECYCLE PILE */}
        {(activePile === 'all' || activePile === 'discard') && (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-rose-200 dark:border-rose-900/40 p-5 space-y-4 shadow-sm flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-rose-100 dark:border-rose-900/30">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                  <Trash2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Pile 3: Discard / Recycle
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Broken, expired, or non-functional waste
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono tabular-nums text-rose-700 dark:text-rose-400 font-semibold">
                {discardCompleted}/{allDiscardItems.length}
              </span>
            </div>

            <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[500px] pr-1">
              {allDiscardItems
                .filter((item) => filterMatches(item.item) || filterMatches(item.ecoDisposalTip))
                .map((item, idx) => {
                  const key = `discard_${idx}_${item.item}`;
                  const isChecked = !!checklistItemsCompleted[key];
                  return (
                    <div
                      key={key}
                      onClick={() => onToggleCheckItem(key)}
                      className={`p-3 rounded-lg border transition-all cursor-pointer text-left ${
                        isChecked
                          ? 'bg-rose-50/50 dark:bg-rose-950/15 border-rose-200 dark:border-rose-900/40 opacity-70'
                          : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 hover:border-rose-300'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <button
                          type="button"
                          className="mt-0.5 text-rose-600 dark:text-rose-400 shrink-0"
                        >
                          {isChecked ? (
                            <CheckCircle2 className="w-4 h-4 fill-rose-600 text-white" />
                          ) : (
                            <Circle className="w-4 h-4" />
                          )}
                        </button>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-xs font-bold text-slate-900 dark:text-white ${
                              isChecked ? 'line-through text-slate-500' : ''
                            }`}
                          >
                            {item.item}
                          </p>
                          <p className="text-[11px] text-rose-700 dark:text-rose-300 font-medium mt-0.5">
                            Disposal tip: {item.ecoDisposalTip}
                          </p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                            {item.rationale}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>

      {/* Bottom CTA to Action Plan */}
      <div className="pt-2 flex justify-end">
        <button
          onClick={onJumpToChecklist}
          className="px-5 py-2.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors flex items-center gap-2 shadow-sm"
        >
          <span>Proceed to Action Plan Checklist</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
