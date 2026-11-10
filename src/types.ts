export type RoomType =
  | 'home_office'
  | 'living_room'
  | 'closet'
  | 'kitchen'
  | 'bedroom'
  | 'kids_room'
  | 'garage'
  | 'bathroom'
  | 'other';

export type DeclutterMethodology =
  | '3_box'
  | 'konmari'
  | 'micro_sprints'
  | 'minimalist';

export interface BoundingBox {
  ymin: number;
  xmin: number;
  ymax: number;
  xmax: number;
}

export interface ClutterZone {
  id: string;
  name: string;
  box: BoundingBox;
  severity: 'high' | 'medium' | 'low';
  currentProblem: string;
  proposedSolution: string;
  recommendedAction: string;
}

export interface KeepItem {
  item: string;
  whereToPut: string;
  rationale: string;
}

export interface DonateItem {
  item: string;
  recipientSuggestion: string;
  rationale: string;
}

export interface DiscardItem {
  item: string;
  ecoDisposalTip: string;
  rationale: string;
}

export interface ThreePileSorting {
  keep: KeepItem[];
  donate: DonateItem[];
  discardOrRecycle: DiscardItem[];
}

export interface StorageRecommendation {
  category: string;
  title: string;
  description: string;
  recommendedPlacement: string;
  diyOrBudgetAlternative: string;
  estimatedCost: string;
}

export interface ActionPlanStep {
  stepNumber: number;
  zone: string;
  title: string;
  details: string;
  durationMinutes: number;
  priority: 'high' | 'medium' | 'low';
}

export interface RoomAnalysisResult {
  roomTypeDetected: string;
  roomSummary: string;
  clutterScore: number;
  totalEstimatedMinutes: number;
  quickWins: string[];
  zones: ClutterZone[];
  threePileSorting: ThreePileSorting;
  storageRecommendations: StorageRecommendation[];
  actionPlan: ActionPlanStep[];
  sustainableHabits: string[];
  transformationVision: string;
}

export interface SavedRoomProject {
  id: string;
  timestamp: number;
  roomName: string;
  roomType: RoomType;
  methodology: DeclutterMethodology;
  imageSrc: string;
  analysis: RoomAnalysisResult;
  completedStepNumbers: number[];
  completedQuickWins: number[];
  checklistItemsCompleted: Record<string, boolean>;
}

export interface SampleRoom {
  id: string;
  title: string;
  roomType: RoomType;
  imageSrc: string;
  description: string;
  typicalClutter: string;
}

export const SAMPLE_ROOMS: SampleRoom[] = [
  {
    id: 'office_desk',
    title: 'Work Desk & Cable Nest',
    roomType: 'home_office',
    imageSrc: '/src/assets/images/sample_office_clutter_1794337200226.jpg',
    description: 'Desk filled with book stacks, scattered paperwork, tangled cables, and mugs.',
    typicalClutter: 'Cables, notebooks, pens, loose notes, paper pileup',
  },
  {
    id: 'living_lounge',
    title: 'Family Living Room',
    roomType: 'living_room',
    imageSrc: '/src/assets/images/sample_living_clutter_1794337200197.jpg',
    description: 'Coffee table crowded with magazines and remotes, blankets displaced, shoes on floor.',
    typicalClutter: 'Magazines, electronics, blankets, floor items',
  },
  {
    id: 'wardrobe_closet',
    title: 'Walk-in Wardrobe Closet',
    roomType: 'closet',
    imageSrc: '/src/assets/images/sample_closet_clutter_1794337201285.jpg',
    description: 'Hangers tangled, overflowing garment racks, shoes piled across the floor.',
    typicalClutter: 'Unsorted shoes, crowded garments, folded piles tipping over',
  },
  {
    id: 'kitchen_counter',
    title: 'Kitchen Island & Countertops',
    roomType: 'kitchen',
    imageSrc: '/src/assets/images/sample_kitchen_clutter_1794337201501.jpg',
    description: 'Spice jars disarray, mail pile on island, multiple small appliances claiming work surfaces.',
    typicalClutter: 'Jars, unopened mail, cutting boards, food prep items',
  },
];
