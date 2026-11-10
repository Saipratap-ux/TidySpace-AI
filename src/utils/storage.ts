import { SavedRoomProject } from '../types';

const STORAGE_KEY = 'tidyspace_saved_rooms_v1';
const CURRENT_ACTIVE_KEY = 'tidyspace_active_room_id';

export function getSavedRooms(): SavedRoomProject[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse saved rooms from localStorage', e);
    return [];
  }
}

export function saveRoomProject(project: SavedRoomProject): void {
  try {
    const current = getSavedRooms();
    const existingIndex = current.findIndex((p) => p.id === project.id);
    if (existingIndex >= 0) {
      current[existingIndex] = project;
    } else {
      current.unshift(project);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    localStorage.setItem(CURRENT_ACTIVE_KEY, project.id);
  } catch (e) {
    console.error('Failed to save room project to localStorage', e);
  }
}

export function deleteRoomProject(id: string): void {
  try {
    const current = getSavedRooms().filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  } catch (e) {
    console.error('Failed to delete room project from localStorage', e);
  }
}

export function getActiveRoomId(): string | null {
  return localStorage.getItem(CURRENT_ACTIVE_KEY);
}

export function setActiveRoomId(id: string): void {
  localStorage.setItem(CURRENT_ACTIVE_KEY, id);
}
