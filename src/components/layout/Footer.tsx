import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Film, Sparkles, Eye, Users, Globe } from 'lucide-react';
import { SITE_CONFIG } from '../../config/site';
import { statsService } from '../../services/statsService';
import { useLanguage } from '../../context/LanguageContext';

export const Footer: React.FC = () => {
  const { language, toggleLanguage, t } = useLanguage();
  const [visits, setVisits] = useState<number>(1);
  const [online, setOnline] = useState<number>(1);

  useEffect(() => {
    statsService.fetchCloudVisits().then(v => setVisits(v));
    statsService.fetchCloudOnline().then(o => setOnline(o));
  }, []);

  return (
    <footer className="bg-midnight-950 border-t border-white/5 pt-16 pb-12 text-slate-400 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/5">
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-red-600 to-amber-500 p-[1px]">
                <div className="w-full h-full bg-midnight-950 rounded-[11px] flex items-center justify-center">
                  <Film className="w-4 h-4 text-red-500" />
                </div>
              </div>
              <span className="text-xl font-display font-extrabold tracking-wider bg-gradient-to-r from-white via-slate-100 to-red-400 bg-clip-text text-transparent">
                {SITE_CONFIG.name}
              </span>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              {SITE_CONFIG.description}
            </p>

            <div className="flex items-center gap-2 text-xs text-red-400/90 bg-red-500/10 px-3 py-1.5 rounded-lg border border-red-500/20 max-w-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{SITE_CONFIG.slogan}</span>
            </div>

            {/* Thống kê truy cập */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-300">
                <Eye className="w-3.5 h-3.5 text-blue-400" />
                <span>{t.totalVisits}</span>
                <span className="font-mono font-bold text-white">{visits.toLocaleString('vi-VN')}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-300">
                <Users className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t.onlineNow}</span>
                <span className="font-mono font-bold text-emerald-400">{online}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
              {t.categoriesTitle}
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/explore?category=phim-le" className="hover:text-red-400 transition">{t.movies}</Link></li>
              <li><Link to="/explore?category=phim-bo" className="hover:text-red-400 transition">{t.series}</Link></li>
              <li><Link to="/explore?category=hoat-hinh" className="hover:text-red-400 transition">{t.anime}</Link></li>
              <li><Link to="/explore?category=tv-shows" className="hover:text-red-400 transition">{t.tvShows}</Link></li>
              <li><Link to="/explore" className="hover:text-red-400 transition">{t.newReleases}</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
              {t.featuresTitle}
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/my-list" className="hover:text-red-400 transition">{t.myList}</Link></li>
              <li><Link to="/explore" className="hover:text-red-400 transition">{t.explore}</Link></li>
              <li><Link to="/explore" className="hover:text-red-400 transition">{t.searchSuggestions}</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
              {t.policyTitle}
            </h4>
            <ul className="space-y-2 text-sm">
              <li><span className="hover:text-slate-300 cursor-pointer">{t.terms}</span></li>
              <li><span className="hover:text-slate-300 cursor-pointer">{t.dmca}</span></li>
              <li><span className="hover:text-slate-300 cursor-pointer">{t.privacy}</span></li>
              <li><span className="hover:text-slate-300 cursor-pointer">{t.contact}: {SITE_CONFIG.contactEmail}</span></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            © {new Date().getFullYear()} {SITE_CONFIG.name}. {t.copyright}
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 hover:text-white transition px-2 py-1 rounded bg-white/5 border border-white/10"
            >
              <Globe className="w-3.5 h-3.5 text-red-400" />
              <span>{language === 'vi' ? 'Tiếng Việt (VN)' : 'English (US)'}</span>
            </button>
            <span>•</span>
            <span>4K / Dolby Atmos Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
