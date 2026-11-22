import { create } from 'zustand';
import { CONFIG } from '../content/config';

export type Stage = "gate" | "intro" | "explore" | "finale";

export type Wish = {
  text: string;
  x: number;
  y: number;
  z: number;
  at: number;
};

export type FocusedTarget = {
  type: "memory" | "planet" | "birthday" | "hidden";
  id: string;
} | null;

interface UniverseState {
  stage: Stage;
  visitedMemories: string[];
  visitedPlanets: string[];
  wishes: Wish[];
  drawnLines: [string, string][];
  audioOn: boolean;
  finaleUnlocked: boolean;
  focusedTarget: FocusedTarget;
  isDrawMode: boolean;
  selectedStarForDraw: string | null;
  isWishPromptOpen: boolean;
  pendingWishPos: [number, number, number] | null;
  cameraFocusPos: [number, number, number] | null;
  isLowQuality: boolean;
  easterEggFound: boolean;
  
  // Actions
  setStage: (s: Stage) => void;
  visitMemory: (id: string) => void;
  visitPlanet: (id: string) => void;
  addWish: (w: Wish) => void;
  toggleAudio: () => void;
  setAudioOn: (on: boolean) => void;
  setFocusedTarget: (target: FocusedTarget) => void;
  setDrawMode: (active: boolean) => void;
  toggleDrawMode: () => void;
  setSelectedStarForDraw: (id: string | null) => void;
  addDrawnLine: (pair: [string, string]) => void;
  setWishPromptOpen: (open: boolean, pos?: [number, number, number]) => void;
  setCameraFocusPos: (pos: [number, number, number] | null) => void;
  setLowQuality: (low: boolean) => void;
  triggerEasterEgg: () => void;
  checkFinaleUnlock: () => void;
  resetUniverse: () => void;
}

// LocalStorage safe helpers
const STORAGE_KEY = 'little_universe_save_v1';

function loadStoredData(): Partial<UniverseState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        visitedMemories: Array.isArray(parsed.visitedMemories) ? parsed.visitedMemories : [],
        visitedPlanets: Array.isArray(parsed.visitedPlanets) ? parsed.visitedPlanets : [],
        wishes: Array.isArray(parsed.wishes) ? parsed.wishes : [],
        drawnLines: Array.isArray(parsed.drawnLines) ? parsed.drawnLines : [],
        finaleUnlocked: Boolean(parsed.finaleUnlocked),
        easterEggFound: Boolean(parsed.easterEggFound),
      };
    }
  } catch (err) {
    console.warn("Could not load from localStorage:", err);
  }
  return {};
}

function saveStoredData(state: UniverseState) {
  try {
    const dataToSave = {
      visitedMemories: state.visitedMemories,
      visitedPlanets: state.visitedPlanets,
      wishes: state.wishes,
      drawnLines: state.drawnLines,
      finaleUnlocked: state.finaleUnlocked,
      easterEggFound: state.easterEggFound,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  } catch (err) {
    console.warn("Could not save to localStorage:", err);
  }
}

// Initial session check for password gate
function isInitiallyUnlocked(): boolean {
  try {
    return sessionStorage.getItem('little_universe_unlocked') === 'true';
  } catch {
    return false;
  }
}

const initialSaved = loadStoredData();

export const useUniverse = create<UniverseState>((set, get) => ({
  stage: isInitiallyUnlocked() ? "intro" : "gate",
  visitedMemories: initialSaved.visitedMemories || [],
  visitedPlanets: initialSaved.visitedPlanets || [],
  wishes: initialSaved.wishes || [],
  drawnLines: initialSaved.drawnLines || [],
  audioOn: false,
  finaleUnlocked: initialSaved.finaleUnlocked || false,
  focusedTarget: null,
  isDrawMode: false,
  selectedStarForDraw: null,
  isWishPromptOpen: false,
  pendingWishPos: null,
  cameraFocusPos: null,
  isLowQuality: false,
  easterEggFound: initialSaved.easterEggFound || false,

  setStage: (stage) => {
    if (stage !== 'gate') {
      try {
        sessionStorage.setItem('little_universe_unlocked', 'true');
      } catch {}
    }
    set({ stage });
  },

  visitMemory: (id) => {
    const state = get();
    if (!state.visitedMemories.includes(id)) {
      const updated = [...state.visitedMemories, id];
      set({ visitedMemories: updated });
      saveStoredData(get());
      get().checkFinaleUnlock();
    }
  },

  visitPlanet: (id) => {
    const state = get();
    if (!state.visitedPlanets.includes(id)) {
      const updated = [...state.visitedPlanets, id];
      set({ visitedPlanets: updated });
      saveStoredData(get());
      get().checkFinaleUnlock();
    }
  },

  addWish: (w) => {
    const state = get();
    const updated = [w, ...state.wishes];
    set({ wishes: updated, isWishPromptOpen: false, pendingWishPos: null });
    saveStoredData(get());
  },

  toggleAudio: () => set((state) => ({ audioOn: !state.audioOn })),
  setAudioOn: (audioOn) => set({ audioOn }),

  setFocusedTarget: (target) => {
    set({ focusedTarget: target });
    if (target?.type === 'memory') {
      get().visitMemory(target.id);
    } else if (target?.type === 'planet') {
      get().visitPlanet(target.id);
    }
  },

  setDrawMode: (isDrawMode) => set({ isDrawMode, selectedStarForDraw: null }),
  toggleDrawMode: () => set((state) => ({ isDrawMode: !state.isDrawMode, selectedStarForDraw: null })),
  setSelectedStarForDraw: (selectedStarForDraw) => set({ selectedStarForDraw }),

  addDrawnLine: (pair) => {
    const state = get();
    // Check if line or reversed line already exists
    const exists = state.drawnLines.some(
      ([a, b]) => (a === pair[0] && b === pair[1]) || (a === pair[1] && b === pair[0])
    );
    if (!exists && pair[0] !== pair[1]) {
      const updated: [string, string][] = [...state.drawnLines, pair];
      set({ drawnLines: updated, selectedStarForDraw: pair[1] });
      saveStoredData(get());
    }
  },

  setWishPromptOpen: (isWishPromptOpen, pos) => {
    set({ isWishPromptOpen, pendingWishPos: pos || null });
  },

  setCameraFocusPos: (pos) => set({ cameraFocusPos: pos }),

  setLowQuality: (isLowQuality) => set({ isLowQuality }),

  triggerEasterEgg: () => {
    const state = get();
    if (!state.easterEggFound) {
      set({ easterEggFound: true });
      saveStoredData(get());
      get().checkFinaleUnlock();
    }
  },

  checkFinaleUnlock: () => {
    const { visitedMemories, visitedPlanets, easterEggFound, finaleUnlocked } = get();
    if (finaleUnlocked) return;
    
    const memoryCount = visitedMemories.length;
    const planetCount = visitedPlanets.length;
    
    // Unlock condition: at least 8 memories and 2 planets OR hidden star found
    if ((memoryCount >= CONFIG.targetUnlockCount && planetCount >= CONFIG.targetPlanetCount) || easterEggFound) {
      set({ finaleUnlocked: true });
      saveStoredData(get());
    }
  },

  resetUniverse: () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem('little_universe_unlocked');
    } catch {}
    set({
      stage: "gate",
      visitedMemories: [],
      visitedPlanets: [],
      wishes: [],
      drawnLines: [],
      finaleUnlocked: false,
      focusedTarget: null,
      easterEggFound: false,
    });
  }
}));
