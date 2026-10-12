import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Compass, Flame, Heart, Zap, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface MoodFilter {
  id: string;
  label: string;
  icon: any;
  category: string;
  keyword?: string;
  description: string;
  badge: string;
}

export const DiscoverySection: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const moods: MoodFilter[] = language === 'en' ? [
    {
      id: 'thrilling',
      label: 'Thrilling & Action',
      icon: Zap,
      category: 'phim-le',
      keyword: 'hành động',
      description: 'Breathtaking chases, high-stakes mind games, and shocking plot twists.',
      badge: 'ACTION'
    },
    {
      id: 'relaxing',
      label: 'Heartwarming & Romance',
      icon: Heart,
      category: 'phim-le',
      keyword: 'tình cảm',
      description: 'Sweet, emotional, and comforting romance movies to heal your soul.',
      badge: 'ROMANCE'
    },
    {
      id: 'sci-fi',
      label: 'Sci-Fi & Fantasy',
      icon: Sparkles,
      category: 'phim-le',
      keyword: 'khoa học',
      description: 'Space journeys, multiverses, and futuristic technological marvels.',
      badge: 'SCI-FI'
    },
    {
      id: 'anime-world',
      label: 'Anime Universe',
      icon: Flame,
      category: 'hoat-hinh',
      keyword: 'anime',
      description: 'Stunning animation and magnificent adventures from Japan.',
      badge: 'ANIME'
    }
  ] : [
    {
      id: 'thrilling',
      label: 'Hồi hộp & Kịch tính',
      icon: Zap,
      category: 'phim-le',
      keyword: 'hành động',
      description: 'Những pha rượt đuổi nghẹt thở, đấu trí căng thẳng và plot twist khó lường.',
      badge: 'HÀNH ĐỘNG'
    },
    {
      id: 'relaxing',
      label: 'Nhẹ nhàng & Chữa lành',
      icon: Heart,
      category: 'phim-le',
      keyword: 'tình cảm',
      description: 'Những thước phim ấm áp, lãng mạn xoa dịu tâm hồn sau ngày dài bận rộn.',
      badge: 'LÃNG MẠN'
    },
    {
      id: 'sci-fi',
      label: 'Khoa học viễn tưởng',
      icon: Sparkles,
      category: 'phim-le',
      keyword: 'khoa học',
      description: 'Du hành vũ trụ, đa vũ trụ và những công nghệ tương lai vượt ngoài sức tưởng tượng.',
      badge: 'VIỄN TƯỞNG'
    },
    {
      id: 'anime-world',
      label: 'Thế giới Anime',
      icon: Flame,
      category: 'hoat-hinh',
      keyword: 'anime',
      description: 'Đồ họa huyền ảo và những chuyến phiêu lưu kỳ thú của xứ sở hoa anh đào.',
      badge: 'HOẠT HÌNH'
    }
  ];

  const handleSelectMood = (mood: MoodFilter) => {
    navigate(`/explore?category=${mood.category}&keyword=${encodeURIComponent(mood.keyword || '')}`);
  };

  return (
    <section className="py-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono text-red-400 uppercase tracking-wider mb-1">
              <Compass className="w-3.5 h-3.5" />
              CINEMATIC DISCOVERY
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">
              {language === 'en' ? 'What Would You Like To Experience Today?' : 'Hôm Nay Bạn Muốn Trải Nghiệm Điều Gì?'}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {moods.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.id}
                onClick={() => handleSelectMood(m)}
                className="relative rounded-3xl p-6 bg-midnight-800/80 hover:bg-midnight-700/80 border border-white/5 hover:border-red-500/40 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-red-950/20 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-2xl bg-midnight-900 border border-white/10 flex items-center justify-center text-red-500 group-hover:scale-110 group-hover:bg-red-600 group-hover:text-white transition-all duration-300">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded">
                      {m.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-red-400 transition-colors">
                    {m.label}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {m.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-300 group-hover:text-red-400 font-semibold transition-colors">
                  <span>{language === 'en' ? 'Explore now' : 'Khám phá ngay'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
