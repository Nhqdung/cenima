import React, { createContext, useContext, useState } from 'react';

export type Language = 'vi' | 'en';

export interface Translations {
  // Navigation
  home: string;
  explore: string;
  movies: string;
  series: string;
  anime: string;
  tvShows: string;
  myList: string;
  searchPlaceholder: string;
  searching: string;
  searchSuggestions: string;
  viewAllResults: string;
  login: string;
  register: string;
  logout: string;
  onlineUsers: string;

  // Hero & Sections
  topTrending: string;
  watchNow: string;
  movieDetails: string;
  addToList: string;
  removeFromList: string;
  continueWatching: string;
  continueWatchingSub: string;
  trendingTitle: string;
  trendingSub: string;
  blockbusterTitle: string;
  blockbusterSub: string;
  seriesTitle: string;
  seriesSub: string;
  animeTitle: string;
  animeSub: string;
  newReleases: string;
  viewAll: string;
  episodes: string;
  duration: string;
  genres: string;
  releaseYear: string;
  quality: string;
  country: string;
  content: string;
  server: string;
  currentViewers: string;
  totalVisits: string;
  onlineNow: string;

  // Movie Card & Badges
  completed: string;
  ongoing: string;

  // Auth Modal
  authLoginTitle: string;
  authRegisterTitle: string;
  authForgotTitle: string;
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  newPassword: string;
  forgotPassword: string;
  sendOtp: string;
  verifyAndReset: string;
  otpCode: string;
  backToLogin: string;
  noAccount: string;
  hasAccount: string;

  // Footer
  categoriesTitle: string;
  featuresTitle: string;
  policyTitle: string;
  terms: string;
  dmca: string;
  privacy: string;
  contact: string;
  copyright: string;

  // Movie Details & Player
  movieInfo: string;
  directors: string;
  actors: string;
  episodeList: string;
  viewAllInPlayer: string;
  moreEpisodes: string;
  similarMovies: string;
  similarMoviesSub: string;
  selectEpisode: string;
  autoSaveProgress: string;
  changeServer: string;
  previousEpisode: string;
  nextEpisode: string;
  sourceUnavailable: string;
  selectOtherServer: string;

  // Comments & Rating
  commentsTitle: string;
  shareThoughts: string;
  score: string;
  writeCommentPlaceholder: string;
  submitComment: string;
  loginToCommentTitle: string;
  loginToCommentDesc: string;
  signInNow: string;
  createAccount: string;
  noCommentsYet: string;
  reply: string;
  replyingTo: string;
  writeReplyPlaceholder: string;
  sendReply: string;
  cancel: string;

  // Explore & Search
  exploreTitle: string;
  exploreCategories: string;
  recentSearches: string;
  popularSearches: string;
  clearAll: string;
  searchResultsFor: string;
  showingPage: string;
  titlesCount: string;
  noMoviesFound: string;
  tryDifferentKeyword: string;
  hot: string;
}

const translations: Record<Language, Translations> = {
  vi: {
    home: 'Trang Chủ',
    explore: 'Khám Phá',
    movies: 'Phim Lẻ',
    series: 'Phim Bộ',
    anime: 'Anime',
    tvShows: 'TV Shows',
    myList: 'Danh Sách Của Tôi',
    searchPlaceholder: 'Tìm phim, diễn viên...',
    searching: 'Đang tìm...',
    searchSuggestions: 'GỢI Ý TÌM KIẾM',
    viewAllResults: 'Xem tất cả kết quả cho',
    login: 'Đăng nhập',
    register: 'Đăng ký',
    logout: 'Đăng xuất',
    onlineUsers: 'đang online',

    topTrending: 'SIÊU PHẨM THỊNH HÀNH',
    watchNow: 'Xem Ngay',
    movieDetails: 'Chi Tiết Phim',
    addToList: 'Lưu Phim',
    removeFromList: 'Bỏ khỏi danh sách',
    continueWatching: 'Tiếp Tục Xem',
    continueWatchingSub: 'Xem tiếp tập phim bạn đang theo dõi',
    trendingTitle: 'Đang Thịnh Hành',
    trendingSub: 'Những bộ phim được yêu thích nhất trong tuần',
    blockbusterTitle: 'Phim Điện Ảnh Bom Tấn',
    blockbusterSub: 'Trải nghiệm chất lượng rạp chiếu ngay tại gia',
    seriesTitle: 'Phim Bộ Đặc Sắc',
    seriesSub: 'Hấp dẫn từng tập phim với phụ đề chuẩn',
    animeTitle: 'Thế Giới Anime Huyền Ảo',
    animeSub: 'Đồ họa đỉnh cao, phiêu lưu kỳ thú',
    newReleases: 'Mới Cập Nhật',
    viewAll: 'Xem tất cả',

    episodes: 'Tập phim',
    duration: 'Thời lượng',
    genres: 'Thể loại',
    releaseYear: 'Năm phát hành',
    quality: 'Chất lượng',
    country: 'Quốc gia',
    content: 'NỘI DUNG PHIM',
    server: 'Máy chủ',
    currentViewers: 'người đang xem',
    totalVisits: 'Lượt truy cập:',
    onlineNow: 'Đang trực tuyến:',

    completed: 'Hoàn tất',
    ongoing: 'Đang chiếu',

    authLoginTitle: 'Đăng Nhập Tài Khoản',
    authRegisterTitle: 'Tạo Tài Khoản Mới',
    authForgotTitle: 'Khôi Phục Mật Khẩu (Bảo Mật)',
    fullName: 'Họ và tên',
    email: 'Email đăng nhập',
    password: 'Mật khẩu',
    confirmPassword: 'Xác nhận lại mật khẩu',
    newPassword: 'Mật khẩu mới',
    forgotPassword: 'Quên mật khẩu?',
    sendOtp: 'Gửi Mã Xác Thực OTP',
    verifyAndReset: 'Xác Nhận & Đổi Mật Khẩu',
    otpCode: 'Nhập mã xác thực OTP (6 số)',
    backToLogin: '← Quay lại Đăng nhập',
    noAccount: 'Chưa có tài khoản? ',
    hasAccount: 'Đã có tài khoản? ',

    categoriesTitle: 'DANH MỤC PHIM',
    featuresTitle: 'TÍNH NĂNG',
    policyTitle: 'CHÍNH SÁCH',
    terms: 'Điều khoản dịch vụ',
    dmca: 'Chính sách bản quyền DMCA',
    privacy: 'Quyền riêng tư dữ liệu',
    contact: 'Liên hệ',
    copyright: 'Phát triển cho trải nghiệm giải trí điện ảnh đỉnh cao.',

    // Movie Details & Player
    movieInfo: 'Thông Tin Phim',
    directors: 'ĐẠO DIỄN:',
    actors: 'DIỄN VIÊN CHÍNH:',
    episodeList: 'Danh Sách Tập',
    viewAllInPlayer: 'Xem tất cả trong Player →',
    moreEpisodes: 'tập nữa',
    similarMovies: 'Có Thể Bạn Sẽ Thích',
    similarMoviesSub: 'Các tác phẩm cùng thể loại được đề xuất',
    selectEpisode: 'Chọn Tập Phim',
    autoSaveProgress: 'Tự động lưu tiến độ xem',
    changeServer: 'Đổi máy chủ:',
    previousEpisode: 'Tập Trước',
    nextEpisode: 'Tập Tiếp Theo',
    sourceUnavailable: 'Nguồn phát chưa khả dụng',
    selectOtherServer: 'Vui lòng chọn máy chủ hoặc tập khác bên dưới.',

    // Comments & Rating
    commentsTitle: 'Bình Luận & Đánh Giá',
    shareThoughts: 'Chia sẻ cảm nhận của bạn với cộng đồng mê phim',
    score: 'Chấm điểm:',
    writeCommentPlaceholder: 'Bạn thấy bộ phim này thế nào? Viết cảm nhận tại đây...',
    submitComment: 'Gửi Đánh Giá',
    loginToCommentTitle: 'Đăng nhập để bình luận và chấm điểm bộ phim',
    loginToCommentDesc: 'Chỉ thành viên đã đăng nhập mới có thể để lại bình luận, thả cảm xúc và thảo luận cùng cộng đồng.',
    signInNow: 'Đăng Nhập Ngay',
    createAccount: 'Tạo Tài Khoản',
    noCommentsYet: 'Chưa có bình luận nào. Hãy là người đầu tiên để lại cảm nghĩ về bộ phim này!',
    reply: 'Trả lời',
    replyingTo: 'Đang trả lời',
    writeReplyPlaceholder: 'Viết câu trả lời của bạn...',
    sendReply: 'Gửi Phản Hồi',
    cancel: 'Hủy',

    // Explore & Search
    exploreTitle: 'Khám Phá & Tìm Kiếm Phim',
    exploreCategories: 'DANH MỤC PHIM',
    recentSearches: 'GẦN ĐÂY',
    popularSearches: 'TÌM KIẾM PHỔ BIẾN',
    clearAll: 'Xóa tất cả',
    searchResultsFor: 'Kết quả tìm kiếm cho:',
    showingPage: 'Hiển thị trang',
    titlesCount: 'tác phẩm',
    noMoviesFound: 'Không tìm thấy phim phù hợp',
    tryDifferentKeyword: 'Hãy thử từ khóa khác hoặc chuyển sang danh mục Phim Mới Cập Nhật.',
    hot: 'Hot'
  },
  en: {
    home: 'Home',
    explore: 'Explore',
    movies: 'Movies',
    series: 'TV Series',
    anime: 'Anime',
    tvShows: 'TV Shows',
    myList: 'My Watchlist',
    searchPlaceholder: 'Search movies, anime, actors...',
    searching: 'Searching...',
    searchSuggestions: 'SEARCH SUGGESTIONS',
    viewAllResults: 'See all results for',
    login: 'Sign In',
    register: 'Sign Up',
    logout: 'Sign Out',
    onlineUsers: 'online now',

    topTrending: 'TOP TRENDING BLOCKBUSTER',
    watchNow: 'Watch Now',
    movieDetails: 'Movie Details',
    addToList: 'Add to List',
    removeFromList: 'Remove from List',
    continueWatching: 'Continue Watching',
    continueWatchingSub: 'Pick up right where you left off',
    trendingTitle: 'Trending Now',
    trendingSub: 'The most popular titles this week',
    blockbusterTitle: 'Blockbuster Movies',
    blockbusterSub: 'Experience cinema quality at home',
    seriesTitle: 'Popular TV Series',
    seriesSub: 'Thrilling episodes with crisp subtitles',
    animeTitle: 'Anime Universe',
    animeSub: 'Stunning animation and epic adventures',
    newReleases: 'New Releases',
    viewAll: 'View all',

    episodes: 'Episodes',
    duration: 'Duration',
    genres: 'Genres',
    releaseYear: 'Release Year',
    quality: 'Quality',
    country: 'Country',
    content: 'STORYLINE & SYNOPSIS',
    server: 'Server',
    currentViewers: 'viewers watching',
    totalVisits: 'Total visits:',
    onlineNow: 'Online users:',

    completed: 'Completed',
    ongoing: 'Ongoing',

    authLoginTitle: 'Sign In to Your Account',
    authRegisterTitle: 'Create a New Account',
    authForgotTitle: 'Password Recovery (Secure)',
    fullName: 'Full Name',
    email: 'Email address',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    newPassword: 'New Password',
    forgotPassword: 'Forgot password?',
    sendOtp: 'Send OTP Verification Code',
    verifyAndReset: 'Verify & Reset Password',
    otpCode: 'Enter 6-digit OTP code',
    backToLogin: '← Back to Sign In',
    noAccount: "Don't have an account? ",
    hasAccount: 'Already have an account? ',

    categoriesTitle: 'CATEGORIES',
    featuresTitle: 'FEATURES',
    policyTitle: 'POLICIES',
    terms: 'Terms of Service',
    dmca: 'DMCA Copyright',
    privacy: 'Data Privacy',
    contact: 'Contact',
    copyright: 'Engineered for premium cinematic streaming entertainment.',

    // Movie Details & Player
    movieInfo: 'Movie Info',
    directors: 'DIRECTOR:',
    actors: 'STARRING CAST:',
    episodeList: 'Episode List',
    viewAllInPlayer: 'Open in Cinema Player →',
    moreEpisodes: 'more episodes',
    similarMovies: 'You May Also Like',
    similarMoviesSub: 'Recommended titles based on genre',
    selectEpisode: 'Select Episode',
    autoSaveProgress: 'Auto saving watch progress',
    changeServer: 'Switch server:',
    previousEpisode: 'Previous Ep',
    nextEpisode: 'Next Episode',
    sourceUnavailable: 'Stream Source Unavailable',
    selectOtherServer: 'Please try another server or episode below.',

    // Comments & Rating
    commentsTitle: 'Reviews & Community Ratings',
    shareThoughts: 'Share your thoughts with the global movie lover community',
    score: 'Rating:',
    writeCommentPlaceholder: 'What did you think of this movie? Share your review...',
    submitComment: 'Submit Review',
    loginToCommentTitle: 'Sign in to rate and comment',
    loginToCommentDesc: 'Only logged-in members can leave reviews, react, and reply to fellow film enthusiasts.',
    signInNow: 'Sign In Now',
    createAccount: 'Create Account',
    noCommentsYet: 'No reviews yet. Be the first to share your thoughts!',
    reply: 'Reply',
    replyingTo: 'Replying to',
    writeReplyPlaceholder: 'Write your reply...',
    sendReply: 'Post Reply',
    cancel: 'Cancel',

    // Explore & Search
    exploreTitle: 'Explore & Search Movies',
    exploreCategories: 'MOVIE CATEGORIES',
    recentSearches: 'RECENT',
    popularSearches: 'TRENDING SEARCHES',
    clearAll: 'Clear all',
    searchResultsFor: 'Search results for:',
    showingPage: 'Page',
    titlesCount: 'titles',
    noMoviesFound: 'No matching titles found',
    tryDifferentKeyword: 'Try another keyword or browse our New Releases catalog.',
    hot: 'Hot'
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('cinemora_lang') as Language;
      return saved === 'en' || saved === 'vi' ? saved : 'vi';
    } catch {
      return 'vi';
    }
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('cinemora_lang', lang);
    } catch {
      // ignore
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'vi' ? 'en' : 'vi');
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

