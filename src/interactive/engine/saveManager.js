const STORAGE_KEY = "hg_interactive_episode_zero";

export function loadEpisodeState(fallback) {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved ? { ...fallback, ...JSON.parse(saved) } : fallback;
  } catch {
    return fallback;
  }
}

export function saveEpisodeState(state) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // The story remains playable if storage is unavailable.
  }
}

export function clearEpisodeState() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // No-op when storage is unavailable.
  }
}
