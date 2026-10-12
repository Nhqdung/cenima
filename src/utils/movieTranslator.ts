// Helper dịch tự động thể loại, quốc gia, trạng thái, danh mục sang tiếng Anh và tiếng Việt

export const GENRE_TRANSLATIONS: Record<string, string> = {
  'Hành Động': 'Action',
  'Hành động': 'Action',
  'Phiêu Lưu': 'Adventure',
  'Phiêu lưu': 'Adventure',
  'Hoạt Hình': 'Animation',
  'Hoạt hình': 'Animation',
  'Hài Hước': 'Comedy',
  'Hài hước': 'Comedy',
  'Hình Sự': 'Crime',
  'Hình sự': 'Crime',
  'Tài Liệu': 'Documentary',
  'Tài liệu': 'Documentary',
  'Chính Kịch': 'Drama',
  'Chính kịch': 'Drama',
  'Gia Đình': 'Family',
  'Gia đình': 'Family',
  'Giả Tưởng': 'Fantasy',
  'Giả tưởng': 'Fantasy',
  'Lịch Sử': 'History',
  'Lịch sử': 'History',
  'Kinh Dị': 'Horror',
  'Kinh dị': 'Horror',
  'Âm Nhạc': 'Music',
  'Âm nhạc': 'Music',
  'Bí Ẩn': 'Mystery',
  'Bí ẩn': 'Mystery',
  'Lãng Mạn': 'Romance',
  'Lãng mạn': 'Romance',
  'Tình Cảm': 'Romance',
  'Tình cảm': 'Romance',
  'Khoa Học Viễn Tưởng': 'Sci-Fi',
  'Khoa học viễn tưởng': 'Sci-Fi',
  'Viễn Tưởng': 'Sci-Fi',
  'Viễn tưởng': 'Sci-Fi',
  'Gây Cấn': 'Thriller',
  'Gây cấn': 'Thriller',
  'Chiến Tranh': 'War',
  'Chiến tranh': 'War',
  'Miền Tây': 'Western',
  'Miền tây': 'Western',
  'Võ Thuật': 'Martial Arts',
  'Võ thuật': 'Martial Arts',
  'Cổ Trang': 'Historical Fiction',
  'Cổ trang': 'Historical Fiction',
  'Tâm Lý': 'Psychological',
  'Tâm lý': 'Psychological',
  'Học Đường': 'School',
  'Học đường': 'School',
  'Thể Thao': 'Sports',
  'Thể thao': 'Sports',
  'Kỳ Ảo': 'Fantasy',
  'Kỳ ảo': 'Fantasy',
  'Thần Thoại': 'Mythology',
  'Thần thoại': 'Mythology',
  'Phim Hot': 'Popular',
  'Xem tiếp': 'Resume'
};

export const COUNTRY_TRANSLATIONS: Record<string, string> = {
  'Việt Nam': 'Vietnam',
  'Trung Quốc': 'China',
  'Hàn Quốc': 'South Korea',
  'Nhật Bản': 'Japan',
  'Mỹ': 'United States',
  'Âu Mỹ': 'United States / Europe',
  'Thái Lan': 'Thailand',
  'Đài Loan': 'Taiwan',
  'Hồng Kông': 'Hong Kong',
  'Ấn Độ': 'India',
  'Anh': 'United Kingdom',
  'Pháp': 'France',
  'Đức': 'Germany',
  'Canada': 'Canada',
  'Tây Ban Nha': 'Spain',
  'Nga': 'Russia',
  'Úc': 'Australia',
  'Quốc tế': 'International'
};

export const STATUS_TRANSLATIONS: Record<string, string> = {
  'Hoàn Tất': 'Completed',
  'Hoàn tất': 'Completed',
  'Full': 'Completed',
  'Đang chiếu': 'Ongoing',
  'Sắp chiếu': 'Upcoming',
  'Đang cập nhật': 'Updating'
};

export const movieTranslator = {
  // Trả về tên phim theo ngôn ngữ: Nếu tiếng Anh -> ưu tiên originalTitle (tên quốc tế), nếu không có mới dùng title
  getTitle(title: string, originalTitle?: string, lang: 'vi' | 'en' = 'vi'): string {
    if (lang === 'en' && originalTitle && originalTitle.trim()) {
      return originalTitle;
    }
    return title;
  },

  // Trả về tên phụ theo ngôn ngữ
  getSubtitle(title: string, originalTitle?: string, lang: 'vi' | 'en' = 'vi'): string {
    if (lang === 'en') {
      return title; // Hiện tên tiếng Việt làm subtitle tham khảo
    }
    return originalTitle || '';
  },

  // Dịch thể loại
  getGenre(genre: string, lang: 'vi' | 'en' = 'vi'): string {
    if (lang === 'en') {
      return GENRE_TRANSLATIONS[genre] || genre;
    }
    return genre;
  },

  // Dịch quốc gia
  getCountry(country: string, lang: 'vi' | 'en' = 'vi'): string {
    if (lang === 'en') {
      return COUNTRY_TRANSLATIONS[country] || country;
    }
    return country;
  },

  // Dịch trạng thái (Full, Hoàn tất, Tập 12,...)
  getStatus(status: string | undefined, lang: 'vi' | 'en' = 'vi'): string {
    if (!status) return '';
    if (lang === 'vi') return status;

    if (STATUS_TRANSLATIONS[status]) {
      return STATUS_TRANSLATIONS[status];
    }
    // Dịch các định dạng như "Tập 12" -> "Ep 12", "Hoàn tất (12/12)" -> "Completed (12/12)"
    return status
      .replace(/Tập\s*/gi, 'Ep ')
      .replace(/Hoàn tất/gi, 'Completed')
      .replace(/Đang cập nhật/gi, 'Updating');
  },

  // Dịch tên tập phim (Tập 01 -> Episode 01)
  getEpisodeName(epName: string, lang: 'vi' | 'en' = 'vi'): string {
    if (lang === 'vi') return epName;
    return epName.replace(/Tập\s*/gi, 'Ep ').replace(/Full/gi, 'Full Movie');
  },

  // Dịch tên máy chủ
  getServerName(serverName: string, lang: 'vi' | 'en' = 'vi'): string {
    if (lang === 'vi') return serverName;
    return serverName
      .replace(/Máy chủ chính/gi, 'Main VIP Server')
      .replace(/Máy chủ dự phòng/gi, 'Backup Server')
      .replace(/Máy chủ/gi, 'Server');
  }
};
