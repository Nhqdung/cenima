import type { Movie, WatchHistoryItem } from '../types/movie';

const MY_LIST_KEY = 'cinemora_my_list';
const WATCH_HISTORY_KEY = 'cinemora_watch_history';

export const storage = {
  // === MY LIST (Yêu thích) ===
  getMyList(): Movie[] {
    try {
      const data = localStorage.getItem(MY_LIST_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  isInMyList(movieId: string): boolean {
    const list = this.getMyList();
    return list.some(m => m.id === movieId || m.slug === movieId);
  },

  toggleMyList(movie: Movie): boolean {
    const list = this.getMyList();
    const index = list.findIndex(m => m.id === movie.id || m.slug === movie.slug);
    let isAdded = false;

    if (index >= 0) {
      list.splice(index, 1);
    } else {
      list.unshift(movie);
      isAdded = true;
    }

    try {
      localStorage.setItem(MY_LIST_KEY, JSON.stringify(list));
    } catch (e) {
      console.error('Failed to save to my list', e);
    }
    return isAdded;
  },

  removeFromMyList(movieId: string): void {
    const list = this.getMyList().filter(m => m.id !== movieId && m.slug !== movieId);
    localStorage.setItem(MY_LIST_KEY, JSON.stringify(list));
  },

  // === WATCH HISTORY (Tiến độ xem phim) ===
  getWatchHistory(): WatchHistoryItem[] {
    try {
      const data = localStorage.getItem(WATCH_HISTORY_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveWatchProgress(item: Omit<WatchHistoryItem, 'updatedAt'>): void {
    const history = this.getWatchHistory();
    const existingIndex = history.findIndex(h => h.movieSlug === item.movieSlug);

    const newItem: WatchHistoryItem = {
      ...item,
      updatedAt: Date.now()
    };

    if (existingIndex >= 0) {
      history.splice(existingIndex, 1);
    }
    history.unshift(newItem);

    // Keep max 30 items
    if (history.length > 30) {
      history.pop();
    }

    try {
      localStorage.setItem(WATCH_HISTORY_KEY, JSON.stringify(history));
    } catch (e) {
      console.error('Failed to save watch progress', e);
    }
  },

  getProgressForMovie(movieSlug: string): WatchHistoryItem | undefined {
    const history = this.getWatchHistory();
    return history.find(h => h.movieSlug === movieSlug);
  },

  removeHistoryItem(movieSlug: string): void {
    const history = this.getWatchHistory().filter(h => h.movieSlug !== movieSlug);
    localStorage.setItem(WATCH_HISTORY_KEY, JSON.stringify(history));
  },

  clearHistory(): void {
    localStorage.removeItem(WATCH_HISTORY_KEY);
  }
};
