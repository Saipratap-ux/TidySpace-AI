/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { RoomUploader } from './components/RoomUploader';
import { InteractivePhotoViewer } from './components/InteractivePhotoViewer';
import { ThreePileSortingView } from './components/ThreePileSortingView';
import { ActionPlanChecklist } from './components/ActionPlanChecklist';
import { StorageGuide } from './components/StorageGuide';
import { TransformationBlueprint } from './components/TransformationBlueprint';
import { OrganizerChatDrawer } from './components/OrganizerChatDrawer';
import { SavedRoomsModal } from './components/SavedRoomsModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import {
  RoomType,
  DeclutterMethodology,
  RoomAnalysisResult,
  SavedRoomProject,
  SAMPLE_ROOMS
} from './types';
import {
  getSavedRooms,
  saveRoomProject,
  deleteRoomProject,
  getActiveRoomId,
  setActiveRoomId
} from './utils/storage';
import { AlertCircle, RefreshCw, Sparkles } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'workspace' | 'sorting' | 'checklist' | 'storage' | 'blueprint'>('workspace');
  const [analysis, setAnalysis] = useState<RoomAnalysisResult | null>(null);
  const [currentImageSrc, setCurrentImageSrc] = useState<string | null>(null);
  const [roomType, setRoomType] = useState<RoomType>('home_office');
  const [methodology, setMethodology] = useState<DeclutterMethodology>('3_box');
  const [currentRoomName, setCurrentRoomName] = useState<string>('My Room');
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);

  // Tracking completion
  const [completedStepNumbers, setCompletedStepNumbers] = useState<number[]>([]);
  const [completedQuickWins, setCompletedQuickWins] = useState<number[]>([]);
  const [checklistItemsCompleted, setChecklistItemsCompleted] = useState<Record<string, boolean>>({});

  // Loading & Error states
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Modals & Drawers
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [savedRooms, setSavedRooms] = useState<SavedRoomProject[]>([]);

  // Theme
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Sync dark mode class on <html>
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Load saved rooms from localStorage on mount
  useEffect(() => {
    const list = getSavedRooms();
    setSavedRooms(list);

    const activeId = getActiveRoomId();
    if (activeId) {
      const activeProject = list.find((p) => p.id === activeId);
      if (activeProject) {
        loadRoomProject(activeProject);
      }
    }
  }, []);

  const loadRoomProject = (project: SavedRoomProject) => {
    setAnalysis(project.analysis);
    setCurrentImageSrc(project.imageSrc);
    setRoomType(project.roomType);
    setMethodology(project.methodology);
    setCurrentRoomName(project.roomName);
    setCompletedStepNumbers(project.completedStepNumbers || []);
    setCompletedQuickWins(project.completedQuickWins || []);
    setChecklistItemsCompleted(project.checklistItemsCompleted || {});
    setActiveTab('workspace');
    setSelectedZoneId(null);
    setActiveRoomId(project.id);
  };

  const persistCurrentRoomState = (
    updatedSteps = completedStepNumbers,
    updatedQuickWins = completedQuickWins,
    updatedChecklist = checklistItemsCompleted
  ) => {
    if (!analysis || !currentImageSrc) return;
    const activeId = getActiveRoomId() || `room_${Date.now()}`;
    const project: SavedRoomProject = {
      id: activeId,
      timestamp: Date.now(),
      roomName: currentRoomName,
      roomType,
      methodology,
      imageSrc: currentImageSrc,
      analysis,
      completedStepNumbers: updatedSteps,
      completedQuickWins: updatedQuickWins,
      checklistItemsCompleted: updatedChecklist,
    };
    saveRoomProject(project);
    setSavedRooms(getSavedRooms());
  };

  const handleAnalyze = async ({
    image,
    mimeType,
    roomType: selectedRoomType,
    methodology: selectedMethod,
    painPoints,
    constraints,
    sampleRoomTitle,
  }: {
    image: string;
    mimeType: string;
    roomType: RoomType;
    methodology: DeclutterMethodology;
    painPoints: string[];
    constraints: string;
    sampleRoomTitle?: string;
  }) => {
    setIsLoading(true);
    setErrorMessage(null);
    setLoadingStep('Inspecting room geometry & spatial composition...');

    const stepInterval = setInterval(() => {
      setLoadingStep((prev) => {
        if (prev.includes('geometry')) return 'Identifying clutter hotspots & wire clusters...';
        if (prev.includes('hotspots')) return 'Cataloging 3-pile sorting breakdown (Keep/Donate/Trash)...';
        if (prev.includes('3-pile')) return 'Formulating sequential action plan & storage systems...';
        return 'Finalizing decluttering blueprint...';
      });
    }, 1800);

    try {
      const response = await fetch('/api/analyze-room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image,
          mimeType,
          roomType: selectedRoomType,
          methodology: selectedMethod,
          painPoints,
          constraints,
        }),
      });

      clearInterval(stepInterval);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server responded with status ${response.status}`);
      }

      const result: RoomAnalysisResult = await response.json();

      setAnalysis(result);
      setCurrentImageSrc(image);
      setRoomType(selectedRoomType);
      setMethodology(selectedMethod);
      setCurrentRoomName(sampleRoomTitle || `${result.roomTypeDetected || 'Home'} Declutter`);
      setCompletedStepNumbers([]);
      setCompletedQuickWins([]);
      setChecklistItemsCompleted({});
      setActiveTab('workspace');
      setSelectedZoneId(null);

      // Save initial state to localStorage
      const newProjectId = `room_${Date.now()}`;
      const newProject: SavedRoomProject = {
        id: newProjectId,
        timestamp: Date.now(),
        roomName: sampleRoomTitle || `${result.roomTypeDetected || 'Home'} Declutter`,
        roomType: selectedRoomType,
        methodology: selectedMethod,
        imageSrc: image,
        analysis: result,
        completedStepNumbers: [],
        completedQuickWins: [],
        checklistItemsCompleted: {},
      };
      saveRoomProject(newProject);
      setSavedRooms(getSavedRooms());
    } catch (err: any) {
      clearInterval(stepInterval);
      console.error('Error during room analysis:', err);
      setErrorMessage(
        err?.message || 'Could not analyze room photo. Please ensure GEMINI_API_KEY is configured in Settings > Secrets.'
      );
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  const handleToggleStep = (stepNumber: number) => {
    let next: number[];
    if (completedStepNumbers.includes(stepNumber)) {
      next = completedStepNumbers.filter((n) => n !== stepNumber);
    } else {
      next = [...completedStepNumbers, stepNumber];
    }
    setCompletedStepNumbers(next);
    persistCurrentRoomState(next, completedQuickWins, checklistItemsCompleted);
  };

  const handleToggleQuickWin = (idx: number) => {
    let next: number[];
    if (completedQuickWins.includes(idx)) {
      next = completedQuickWins.filter((n) => n !== idx);
    } else {
      next = [...completedQuickWins, idx];
    }
    setCompletedQuickWins(next);
    persistCurrentRoomState(completedStepNumbers, next, checklistItemsCompleted);
  };

  const handleToggleCheckItem = (key: string) => {
    const next = {
      ...checklistItemsCompleted,
      [key]: !checklistItemsCompleted[key],
    };
    setChecklistItemsCompleted(next);
    persistCurrentRoomState(completedStepNumbers, completedQuickWins, next);
  };

  const handleDeleteRoom = (id: string) => {
    deleteRoomProject(id);
    const updated = getSavedRooms();
    setSavedRooms(updated);
    if (getActiveRoomId() === id) {
      if (updated.length > 0) {
        loadRoomProject(updated[0]);
      } else {
        setAnalysis(null);
        setCurrentImageSrc(null);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Top Bar Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        hasAnalysis={!!analysis}
        onNewScan={() => {
          setAnalysis(null);
          setCurrentImageSrc(null);
          setErrorMessage(null);
        }}
        onOpenHistory={() => setIsHistoryOpen(true)}
        savedRoomsCount={savedRooms.length}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Error notification banner if API failed */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-start justify-between gap-3 text-xs text-rose-800 dark:text-rose-200">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block mb-0.5">Analysis Failed</span>
                <span>{errorMessage}</span>
              </div>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-600 dark:text-rose-400 hover:underline shrink-0"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* View 1: Room Uploader (when no analysis loaded) */}
        {!analysis && (
          <RoomUploader
            onAnalyze={handleAnalyze}
            isLoading={isLoading}
            loadingStep={loadingStep}
          />
        )}

        {/* View 2: Active Room Inspection Workspace */}
        {analysis && currentImageSrc && (
          <div className="space-y-6">
            {/* Context Breadcrumb / Room Title Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span>Rooms</span>
                <span aria-hidden="true">/</span>
                <span className="font-bold text-slate-900 dark:text-white capitalize">
                  {currentRoomName}
                </span>
                <span aria-hidden="true">·</span>
                <span className="text-teal-600 dark:text-teal-400 font-medium">
                  {analysis.roomTypeDetected}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setAnalysis(null);
                    setCurrentImageSrc(null);
                  }}
                  className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Scan another room</span>
                </button>
              </div>
            </div>

            {/* Sub-Tabs Navigation for active room analysis */}
            {activeTab === 'workspace' && (
              <InteractivePhotoViewer
                imageSrc={currentImageSrc}
                analysis={analysis}
                selectedZoneId={selectedZoneId}
                onSelectZone={setSelectedZoneId}
                onJumpToSorting={() => setActiveTab('sorting')}
                onJumpToChecklist={() => setActiveTab('checklist')}
              />
            )}

            {activeTab === 'sorting' && (
              <ThreePileSortingView
                sorting={analysis.threePileSorting}
                checklistItemsCompleted={checklistItemsCompleted}
                onToggleCheckItem={handleToggleCheckItem}
                onJumpToChecklist={() => setActiveTab('checklist')}
              />
            )}

            {activeTab === 'checklist' && (
              <ActionPlanChecklist
                steps={analysis.actionPlan}
                quickWins={analysis.quickWins}
                completedStepNumbers={completedStepNumbers}
                completedQuickWins={completedQuickWins}
                onToggleStep={handleToggleStep}
                onToggleQuickWin={handleToggleQuickWin}
                onJumpToStorage={() => setActiveTab('storage')}
              />
            )}

            {activeTab === 'storage' && (
              <StorageGuide
                recommendations={analysis.storageRecommendations}
                roomType={analysis.roomTypeDetected}
              />
            )}

            {activeTab === 'blueprint' && (
              <TransformationBlueprint
                analysis={analysis}
                roomType={analysis.roomTypeDetected}
                imageSrc={currentImageSrc}
              />
            )}
          </div>
        )}
      </main>

      {/* Floating Organizer AI Chat Drawer */}
      <OrganizerChatDrawer
        analysis={analysis}
        isOpen={isChatOpen}
        onToggle={() => setIsChatOpen(!isChatOpen)}
      />

      {/* Saved Rooms Project Manager Modal */}
      <SavedRoomsModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        savedRooms={savedRooms}
        onSelectRoom={loadRoomProject}
        onDeleteRoom={handleDeleteRoom}
      />

      {/* Offline Status Toast */}
      <OfflineIndicator />
    </div>
  );
}
