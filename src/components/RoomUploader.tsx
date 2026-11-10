import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  Camera,
  Image as ImageIcon,
  Sparkles,
  Check,
  Zap,
  SlidersHorizontal,
  Layers,
  ArrowRight
} from 'lucide-react';
import {
  RoomType,
  DeclutterMethodology,
  SAMPLE_ROOMS,
  SampleRoom
} from '../types';
import { fileToBase64, resizeImageIfNeeded, assetUrlToBase64 } from '../utils/imageUtils';

interface RoomUploaderProps {
  onAnalyze: (payload: {
    image: string;
    mimeType: string;
    roomType: RoomType;
    methodology: DeclutterMethodology;
    painPoints: string[];
    constraints: string;
    sampleRoomTitle?: string;
  }) => Promise<void>;
  isLoading: boolean;
  loadingStep: string;
}

const ROOM_TYPE_OPTIONS: { id: RoomType; label: string }[] = [
  { id: 'home_office', label: 'Home Office' },
  { id: 'living_room', label: 'Living Room' },
  { id: 'closet', label: 'Wardrobe Closet' },
  { id: 'kitchen', label: 'Kitchen & Pantry' },
  { id: 'bedroom', label: 'Bedroom' },
  { id: 'kids_room', label: 'Playroom' },
  { id: 'garage', label: 'Garage & Utility' },
  { id: 'bathroom', label: 'Bathroom' },
];

const METHODOLOGY_OPTIONS: {
  id: DeclutterMethodology;
  title: string;
  description: string;
}[] = [
  {
    id: '3_box',
    title: '3-Box Classic',
    description: 'Immediate decisive sorting into Keep, Donate, and Discard/Recycle.',
  },
  {
    id: 'micro_sprints',
    title: '15-Min Micro Sprints',
    description: 'Bite-sized, zero-overwhelm cleaning bursts for busy schedules.',
  },
  {
    id: 'konmari',
    title: 'KonMari Method',
    description: 'Category-first organizing honoring sentimental value and daily joy.',
  },
  {
    id: 'minimalist',
    title: 'Minimalist Surfaces',
    description: 'Clearing horizontal surfaces and establishing clear visual breathing room.',
  },
];

const COMMON_PAIN_POINTS = [
  'Cable & wire tangles',
  'Paperwork & unopened mail',
  'Surface piling / no desk room',
  'Unsorted clothes / laundry',
  'Floor bottlenecks',
  'Overfilled open shelves',
  'Sentimental item hesitation',
  'Lack of labeled storage',
];

export const RoomUploader: React.FC<RoomUploaderProps> = ({
  onAnalyze,
  isLoading,
  loadingStep,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('image/jpeg');
  const [roomType, setRoomType] = useState<RoomType>('home_office');
  const [methodology, setMethodology] = useState<DeclutterMethodology>('3_box');
  const [painPoints, setPainPoints] = useState<string[]>([
    'Cable & wire tangles',
    'Surface piling / no desk room',
  ]);
  const [constraints, setConstraints] = useState<string>('Rental-friendly, budget under $40, no wall drilling');
  const [activeSampleId, setActiveSampleId] = useState<string | null>('office_desk');
  const [dragActive, setDragActive] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize with the first sample image for immediate zero-friction demo experience!
  React.useEffect(() => {
    if (!selectedImage && SAMPLE_ROOMS.length > 0) {
      const defaultSample = SAMPLE_ROOMS[0];
      assetUrlToBase64(defaultSample.imageSrc)
        .then((base64) => {
          setSelectedImage(base64);
          setMimeType('image/jpeg');
          setRoomType(defaultSample.roomType);
          setActiveSampleId(defaultSample.id);
        })
        .catch((err) => console.log('Sample load error:', err));
    }
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        const { base64, mimeType: detectedMime } = await resizeImageIfNeeded(file);
        setSelectedImage(base64);
        setMimeType(detectedMime);
        setActiveSampleId(null);
      } catch (err) {
        console.error('Failed to process image', err);
      }
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      try {
        const { base64, mimeType: detectedMime } = await resizeImageIfNeeded(file);
        setSelectedImage(base64);
        setMimeType(detectedMime);
        setActiveSampleId(null);
      } catch (err) {
        console.error('Failed to read dropped file', err);
      }
    }
  };

  const selectSampleRoom = async (sample: SampleRoom) => {
    setActiveSampleId(sample.id);
    setRoomType(sample.roomType);
    try {
      const base64 = await assetUrlToBase64(sample.imageSrc);
      setSelectedImage(base64);
      setMimeType('image/jpeg');
    } catch (err) {
      console.error('Failed to load sample image base64', err);
      setSelectedImage(sample.imageSrc);
    }
  };

  const togglePainPoint = (point: string) => {
    if (painPoints.includes(point)) {
      setPainPoints(painPoints.filter((p) => p !== point));
    } else {
      setPainPoints([...painPoints, point]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedImage) return;

    const sample = SAMPLE_ROOMS.find((s) => s.id === activeSampleId);

    await onAnalyze({
      image: selectedImage,
      mimeType,
      roomType,
      methodology,
      painPoints,
      constraints,
      sampleRoomTitle: sample?.title,
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Intro hero banner */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          AI-Powered Room Declutter & Organization
        </h1>
        <p className="mt-3 text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          Upload any photo of your room to detect clutter hotspots, generate an actionable 3-pile sorting breakdown, and receive tailored spatial storage systems.
        </p>
      </div>

      {/* Main Upload Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Image Upload & Preset Rooms */}
        <div className="lg:col-span-7 space-y-6">
          {/* Preset Samples Strip */}
          <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Or try one of our realistic sample rooms:
              </span>
              <span className="text-xs text-slate-500">Instant test</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {SAMPLE_ROOMS.map((sample) => {
                const isSelected = activeSampleId === sample.id;
                return (
                  <button
                    key={sample.id}
                    type="button"
                    onClick={() => selectSampleRoom(sample)}
                    className={`relative group rounded-lg overflow-hidden border text-left transition-all ${
                      isSelected
                        ? 'border-teal-600 ring-2 ring-teal-600/30 dark:border-teal-400'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-400'
                    }`}
                  >
                    <div className="aspect-[4/3] w-full bg-slate-200 dark:bg-slate-800 relative">
                      <img
                        src={sample.imageSrc}
                        alt={sample.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center shadow-sm">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <div className="p-2 bg-white dark:bg-slate-900">
                      <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {sample.title}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {sample.roomType.replace('_', ' ')}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Upload Dropzone */}
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`relative rounded-xl border-2 border-dashed transition-all p-6 text-center ${
              dragActive
                ? 'border-teal-500 bg-teal-50/50 dark:bg-teal-950/20'
                : selectedImage
                ? 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900'
                : 'border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-900/60 hover:bg-slate-100/60'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              className="hidden"
            />

            {selectedImage ? (
              <div className="space-y-4">
                <div className="relative aspect-[4/3] w-full max-h-[380px] rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 flex items-center justify-center">
                  <img
                    src={selectedImage}
                    alt="Room Preview"
                    className="max-h-[380px] w-full object-contain"
                  />
                  <div className="absolute top-3 right-3 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 bg-black/70 hover:bg-black/90 text-white text-xs font-medium rounded-md backdrop-blur-sm transition-colors flex items-center gap-1.5"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Change Photo</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                  <span>Photo loaded and ready for spatial inspection</span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedImage(null);
                      setActiveSampleId(null);
                    }}
                    className="text-rose-600 dark:text-rose-400 hover:underline"
                  >
                    Clear photo
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-8 px-4 flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-4">
                  <UploadCloud className="w-7 h-7" />
                </div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">
                  Upload your room photo
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-4">
                  Take a photo with your phone or drag and drop JPG, PNG, or WEBP images.
                </p>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors flex items-center gap-2 shadow-sm"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Select Photo</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Customization & Goals */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Decluttering Settings & Goals
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Customize the AI recommendations to your lifestyle and space constraints.
            </p>
          </div>

          {/* Room Type Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Room Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {ROOM_TYPE_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setRoomType(opt.id)}
                  className={`px-3 py-2 text-xs font-medium rounded-lg border text-left transition-colors ${
                    roomType === opt.id
                      ? 'border-teal-600 bg-teal-50 text-teal-900 dark:bg-teal-950/30 dark:border-teal-400 dark:text-teal-200 font-semibold'
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Decluttering Methodology */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Decluttering Strategy
            </label>
            <div className="space-y-2">
              {METHODOLOGY_OPTIONS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMethodology(m.id)}
                  className={`w-full p-2.5 rounded-lg border text-left transition-all ${
                    methodology === m.id
                      ? 'border-teal-600 bg-teal-50/60 dark:bg-teal-950/20 dark:border-teal-400'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {m.title}
                    </span>
                    {methodology === m.id && (
                      <span className="w-4 h-4 rounded-full bg-teal-600 text-white flex items-center justify-center text-[10px]">
                        ✓
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 leading-snug">
                    {m.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Common Pain Points */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Primary Bottlenecks (Select all that apply)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_PAIN_POINTS.map((point) => {
                const isSelected = painPoints.includes(point);
                return (
                  <button
                    key={point}
                    type="button"
                    onClick={() => togglePainPoint(point)}
                    className={`px-2.5 py-1 text-xs rounded-md border transition-colors ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900 dark:bg-slate-100 dark:text-slate-900 dark:border-slate-100 font-medium'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {point}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Constraints & Budget */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Constraints & Preferences
            </label>
            <input
              type="text"
              value={constraints}
              onChange={(e) => setConstraints(e.target.value)}
              placeholder="e.g. Budget under $30, rental-friendly, pet-friendly..."
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="button"
              disabled={!selectedImage || isLoading}
              onClick={handleSubmit}
              className={`w-full py-3 px-4 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-sm ${
                !selectedImage || isLoading
                  ? 'bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-600 cursor-not-allowed'
                  : 'bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 text-white'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{loadingStep || 'Analyzing space with AI...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze Room & Generate Plan</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>

            {isLoading && (
              <p className="text-center text-[11px] text-slate-500 dark:text-slate-400 mt-2 animate-pulse">
                Detecting clutter zones, cataloging items, and calculating storage recommendations...
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
