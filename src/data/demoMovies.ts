import type { Movie } from '../types/movie';

export const DEMO_BACKUP_MOVIES: Movie[] = [
  {
    id: 'dune-part-two',
    slug: 'dune-phan-hai-dune-part-two',
    title: 'Dune: Phần Hai',
    originalTitle: 'Dune: Part Two',
    description: 'Paul Atreides hợp lực cùng Chani và tộc Fremen khi tìm cách trả thù những kẻ đã hủy diệt gia tộc mình. Đối mặt với lựa chọn giữa tình yêu và số phận vũ trụ, Paul phải ngăn chặn một tương lai đen tối mà chỉ anh có thể nhìn thấy.',
    poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1600&auto=format&fit=crop',
    releaseYear: 2024,
    genres: ['Khoa Học Viễn Tưởng', 'Phiêu Lưu', 'Hành Động'],
    country: 'Âu Mỹ',
    duration: '166 phút',
    rating: '8.6',
    type: 'single',
    status: 'Hoàn Tất',
    quality: '4K Ultra HD',
    lang: 'Vietsub + Thuyết Minh',
    actors: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson', 'Austin Butler'],
    directors: ['Denis Villeneuve'],
    trailerUrl: 'https://www.youtube.com/watch?v=Way9Dexny3w',
    servers: [
      {
        serverName: 'Server VIP 1 (Aurora)',
        episodes: [
          {
            serverName: 'Server VIP 1 (Aurora)',
            name: 'Full Phim',
            slug: 'full',
            linkEmbed: 'https://www.youtube.com/embed/Way9Dexny3w',
            linkM3u8: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
          }
        ]
      }
    ]
  },
  {
    id: 'oppenheimer',
    slug: 'oppenheimer',
    title: 'Oppenheimer',
    originalTitle: 'Oppenheimer',
    description: 'Câu chuyện về nhà vật lý lý thuyết J. Robert Oppenheimer, người lãnh đạo Dự án Manhattan phát triển vũ khí hạt nhân đầu tiên của nhân loại và những dằn vặt đạo đức sau cuộc thử nghiệm Trinity.',
    poster: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=600&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop',
    releaseYear: 2023,
    genres: ['Lịch Sử', 'Tâm Lý', 'Chính Kịch'],
    country: 'Âu Mỹ',
    duration: '180 phút',
    rating: '8.9',
    type: 'single',
    status: 'Hoàn Tất',
    quality: '4K Ultra HD',
    lang: 'Vietsub',
    actors: ['Cillian Murphy', 'Emily Blunt', 'Matt Damon', 'Robert Downey Jr.'],
    directors: ['Christopher Nolan'],
    servers: [
      {
        serverName: 'Server VIP 1 (Aurora)',
        episodes: [
          {
            serverName: 'Server VIP 1 (Aurora)',
            name: 'Full Phim',
            slug: 'full',
            linkEmbed: 'https://www.youtube.com/embed/uYPbbksJxIg',
            linkM3u8: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
          }
        ]
      }
    ]
  },
  {
    id: 'interstellar',
    slug: 'hoang-dao-lien-sao-interstellar',
    title: 'Hố Đen Tử Thần',
    originalTitle: 'Interstellar',
    description: 'Khi Trái Đất không còn là nơi có thể sinh sống được trong tương lai, một nhóm nhà thám hiểm sử dụng một lỗ sâu mới được phát hiện để du hành vượt qua ranh giới của không gian và thời gian nhằm tìm kiếm ngôi nhà mới cho nhân loại.',
    poster: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1600&auto=format&fit=crop',
    releaseYear: 2014,
    genres: ['Khoa Học Viễn Tưởng', 'Phiêu Lưu', 'Bí Ẩn'],
    country: 'Âu Mỹ',
    duration: '169 phút',
    rating: '8.7',
    type: 'single',
    status: 'Hoàn Tất',
    quality: 'Full HD',
    lang: 'Vietsub + Thuyết Minh',
    actors: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain'],
    directors: ['Christopher Nolan'],
    servers: [
      {
        serverName: 'Server VIP 1 (Aurora)',
        episodes: [
          {
            serverName: 'Server VIP 1 (Aurora)',
            name: 'Full Phim',
            slug: 'full',
            linkEmbed: 'https://www.youtube.com/embed/zSWdZVtXT7E',
            linkM3u8: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'
          }
        ]
      }
    ]
  },
  {
    id: 'arcane',
    slug: 'arcane-lien-minh-huyen-thoai',
    title: 'Arcane: Liên Minh Huyền Thoại',
    originalTitle: 'Arcane: League of Legends',
    description: 'Giữa sự bất hòa gay gắt giữa hai thành phố sinh đôi Piltover và Zaun, hai chị em Vi và Jinx chiến đấu ở hai phe đối lập trong cuộc chiến giữa các công nghệ ma thuật và những niềm tin trái ngược.',
    poster: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=600&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop',
    releaseYear: 2024,
    genres: ['Anime', 'Hành Động', 'Khoa Học Viễn Tưởng'],
    country: 'Âu Mỹ',
    duration: '45 phút/tập',
    rating: '9.0',
    type: 'anime',
    status: 'Mùa 2 Đang Chiếu',
    currentEpisode: 'Tập 09',
    totalEpisodes: '18 Tập',
    quality: 'Full HD',
    lang: 'Vietsub',
    actors: ['Hailee Steinfeld', 'Ella Purnell', 'Kevin Alejandro'],
    directors: ['Pascal Charrue', 'Arnaud Delord'],
    servers: [
      {
        serverName: 'Server VIP 1 (Aurora)',
        episodes: [
          {
            serverName: 'Server VIP 1 (Aurora)',
            name: 'Tập 01',
            slug: 'tap-01',
            linkEmbed: 'https://www.youtube.com/embed/fXmAurh012s',
            linkM3u8: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4'
          },
          {
            serverName: 'Server VIP 1 (Aurora)',
            name: 'Tập 02',
            slug: 'tap-02',
            linkEmbed: 'https://www.youtube.com/embed/fXmAurh012s',
            linkM3u8: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
          }
        ]
      }
    ]
  }
];
