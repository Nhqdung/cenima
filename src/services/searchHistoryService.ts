// Dịch vụ quản lý lịch sử tìm kiếm gần đây và gợi ý tìm kiếm phổ biến

const RECENT_SEARCHES_KEY = 'dung_cinema_recent_searches';
const MAX_RECENT_ITEMS = 8;

export const POPULAR_SEARCHES = [
  'Avengers',
  'Squid Game',
  'One Piece',
  'Doraemon',
  'Conan',
  'Naruto',
  'Interstellar',
  'Lật Mặt',
  'Gặp Lại Chị Bầu',
  'Avatar'
];

export const searchHistoryService = {
  // Lấy danh sách từ khóa tìm kiếm gần đây
  getRecentSearches(): string[] {
    try {
      const data = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (!data) return [];
      const list = JSON.parse(data);
      return Array.isArray(list) ? list : [];
    } catch {
      return [];
    }
  },

  // Lưu từ khóa vừa tìm kiếm
  addRecentSearch(query: string): string[] {
    const trimmed = query.trim();
    if (!trimmed) return this.getRecentSearches();

    try {
      const current = this.getRecentSearches();
      // Đưa từ khóa mới lên đầu, lọc bỏ trùng lặp
      const updated = [trimmed, ...current.filter(item => item.toLowerCase() !== trimmed.toLowerCase())].slice(0, MAX_RECENT_ITEMS);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      return updated;
    } catch {
      return [];
    }
  },

  // Xóa một từ khóa khỏi lịch sử
  removeRecentSearch(query: string): string[] {
    try {
      const current = this.getRecentSearches();
      const updated = current.filter(item => item.toLowerCase() !== query.toLowerCase());
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      return updated;
    } catch {
      return [];
    }
  },

  // Xóa toàn bộ lịch sử tìm kiếm
  clearAllRecentSearches(): void {
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch {}
  }
};
